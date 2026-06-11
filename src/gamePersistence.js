import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { getDocs, query, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { runInAction } from "mobx";
import { db, auth } from "./firebase";

const COLLECTION = "footballQuiz";

// fallback values if the user has no saved game yet
const DEFAULT_STATE = {
  quiz_score: 100,
  quizInput: "",
  guesses: [],
  nrOfGuesses: 0,
  winStatus: false,
  apiCalls: 0,
  currentUserId: 0,
  scoreSaved: false,
  localScores: [],
  gameHistory: [],
  answer: null,
};

// firebase does not like saving some objects directly, so this makes plain data
function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

// each logged in user gets their own saved document
function userDocRef(model) {
  return doc(db, COLLECTION, model.user.uid);
}

// leaderboard only keeps the best score for each user
function saveSharedLeaderboardScore(model) {
  if (!model.user) {
    return;
  }

  const userName = model.user.displayName || model.user.email || "User";
  const leaderboardRef = doc(db, "leaderboard", model.user.uid);

  return getDoc(leaderboardRef)
    .then(function checkPreviousScoreACB(snapshot) {
      const oldScore = snapshot.exists() ? snapshot.data().score : 0;

      // only overwrite if the new score is better than the old one
      if (model.quiz_score > oldScore) {
        return setDoc(
          leaderboardRef,
          {
            userId: model.user.uid,
            username: userName,
            score: model.quiz_score,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      }
    })
    .catch(console.error);
}

// saves the latest finished game so it can be shown in history
function saveGameHistory(model) {
  if (!model.user) {
    return;
  }

  const latestGame = model.gameHistory?.[model.gameHistory.length - 1];

  if (!latestGame) {
    return;
  }

  const userName = model.user.displayName || model.user.email || "User";

  // use game id as document id so the same game is not duplicated
  return setDoc(
    doc(db, "history", String(latestGame.id)),
    {
      userId: model.user.uid,
      username: userName,
      score: latestGame.score,
      answer: latestGame.answer,
      guesses: latestGame.guesses,
      won: latestGame.won,
      createdAt: latestGame.createdAt,
    },
    { merge: true }
  ).catch(console.error);
}

// reads global leaderboard once, mostly kept for fallback/testing
export function getSharedLeaderboard() {
  return getDocs(
    query(
      collection(db, "leaderboard"),
      orderBy("score", "desc")
    )
  ).then(function leaderboardACB(snapshot) {
    return snapshot.docs.map(function docToScoreACB(doc) {
      return {
        id: doc.id,
        username: doc.data().username,
        total_score: doc.data().score,
        createdAt: doc.data().updatedAt,
      };
    });
  });
}

// only save the parts of the model that should survive refresh
function persistencePayload(model){
   return clone({
      quiz_score:model.quiz_score,
      quizInput:model.quizInput,
      answer:model.answer,
      guesses:model.guesses,
      nrOfGuesses:model.nrOfGuesses,
      winStatus:model.winStatus,
      localScores:model.localScores,
      apiCalls:model.apiCalls,
      currentUserId:model.currentUserId,
      scoreSaved:model.scoreSaved,
      gameHistory:model.gameHistory
   });
}

// puts saved firebase data back into the model
function applyPersistedState(model, data = {}) {
  model.quiz_score = data.quiz_score ?? DEFAULT_STATE.quiz_score;
  model.quizInput = data.quizInput ?? DEFAULT_STATE.quizInput;
  model.answer = data.answer ?? null;

  // image urls can be blob urls, so they should be loaded again instead
  model.playerImageUrl = null;

  model.guesses = Array.isArray(data.guesses)
    ? data.guesses
    : DEFAULT_STATE.guesses;

  model.nrOfGuesses = data.nrOfGuesses ?? DEFAULT_STATE.nrOfGuesses;
  model.winStatus = data.winStatus ?? DEFAULT_STATE.winStatus;

  // old firebase docs used "users", new code uses "localScores"
  model.localScores = Array.isArray(data.localScores)
    ? data.localScores
    : Array.isArray(data.users)
      ? data.users
      : DEFAULT_STATE.localScores;

  model.apiCalls = data.apiCalls ?? DEFAULT_STATE.apiCalls;
  model.currentUserId = data.currentUserId ?? DEFAULT_STATE.currentUserId;
  model.scoreSaved = data.scoreSaved ?? DEFAULT_STATE.scoreSaved;

  model.gameHistory = Array.isArray(data.gameHistory)
    ? data.gameHistory
    : DEFAULT_STATE.gameHistory;
}

// used when user logs out or has no saved document
function wipeUserData(model) {
  applyPersistedState(model, DEFAULT_STATE);
}

// converts leaderboard firebase docs into the format score page already uses
function leaderboardSnapshotToScores(snapshot) {
  return snapshot.docs.map(function docToScoreACB(doc) {
    return {
      id: doc.id,
      username: doc.data().username,
      total_score: doc.data().score,
      createdAt: doc.data().updatedAt,
    };
  });
}

// connects firebase auth and firestore to the model
export function connectToPersistence(model, watchFunction) {
  let unsubscribeUserDoc = null;
  let unsubscribeLeaderboard = null;
  let applyingRemoteData = false;

  runInAction(function initAuthStateACB() {
    model.user = undefined;
    model.ready = false;
  });

  // save normal game state when important model data changes
  watchFunction(
    function persistableStateACB() {
      return JSON.stringify({
        userId: model.user?.uid,
        quiz_score: model.quiz_score,
        quizInput: model.quizInput,
        answer: model.answer,
        guesses: model.guesses,
        nrOfGuesses: model.nrOfGuesses,
        winStatus: model.winStatus,
        localScores: model.localScores,
        gameHistory: model.gameHistory,
        apiCalls: model.apiCalls,
        currentUserId: model.currentUserId,
        scoreSaved: model.scoreSaved,
      });
    },

    function saveModelACB() {
      if (!model.ready || !model.user || applyingRemoteData) {
        return;
      }

      setDoc(userDocRef(model), persistencePayload(model), { merge: true })
        .catch(console.error);
    }
  );

  // when a game ends, save leaderboard and history once
  watchFunction(
    function finishedGameACB() {
      const latestGame = model.gameHistory?.[model.gameHistory.length - 1];

      if (model.user && model.scoreSaved && latestGame) {
        return latestGame.id;
      }

      return null;
    },

    function saveFinishedGameACB(finishedGameId) {
      if (!finishedGameId || !model.ready || !model.user || applyingRemoteData) {
        return;
      }

      Promise.all([
        saveSharedLeaderboardScore(model),
        saveGameHistory(model),
      ]).catch(console.error);
    }
  );

  // starts live listening to the global leaderboard
  function subscribeToLeaderboardACB() {
    if (unsubscribeLeaderboard) {
      unsubscribeLeaderboard();
      unsubscribeLeaderboard = null;
    }

    const leaderboardQuery = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc")
    );

    unsubscribeLeaderboard = onSnapshot(
      leaderboardQuery,
      function leaderboardChangedACB(snapshot) {
        runInAction(function updateLeaderboardACB() {
          model.setGlobalScores(leaderboardSnapshotToScores(snapshot));
        });
      },
      console.error
    );
  }

  // starts live listening to this user's saved game
  function subscribeToUserDocACB(user) {
    if (unsubscribeUserDoc) {
      unsubscribeUserDoc();
      unsubscribeUserDoc = null;
    }

    unsubscribeUserDoc = onSnapshot(
      doc(db, COLLECTION, user.uid),

      function userDocChangedACB(snapshot) {
            applyingRemoteData = true;

            runInAction(function applyUserDataACB() {
              if (snapshot.exists()) {
                applyPersistedState(model, snapshot.data());
              } else {
                wipeUserData(model);
              }

              model.user = user;
              model.ready = true;
            });

            applyingRemoteData = false;
          
      },

      function userDocErrorACB(error) {
        console.error(error);

        applyingRemoteData = true;

        runInAction(function readyAfterErrorACB() {
          wipeUserData(model);
          model.user = user;
          model.ready = true;
        });

        applyingRemoteData = false;
      }
    );
  }

  // firebase tells us here if user logged in or out
  onAuthStateChanged(auth, function authChangedACB(user) {
    runInAction(function setUserBeforeReadACB() {
      model.ready = false;
    });

    if (unsubscribeUserDoc) {
      unsubscribeUserDoc();
      unsubscribeUserDoc = null;
    }

    if (unsubscribeLeaderboard) {
      unsubscribeLeaderboard();
      unsubscribeLeaderboard = null;
    }

    // clear local data when logged out
    if (!user) {
  applyingRemoteData = true;

  runInAction(function logoutACB() {
    model.user = null;
    model.ready = true;
  });

  applyingRemoteData = false;
  return;
}

    // from here the model updates live when firebase changes
    subscribeToLeaderboardACB();
    subscribeToUserDocACB(user);
  });
}