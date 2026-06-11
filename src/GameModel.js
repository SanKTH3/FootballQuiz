import { runInAction } from "mobx";
import { localPlayers } from "./playerNames";
import { getPlayerByName, getPlayerImageById, getTeamImageById, } from "./footballSource";
import { resolvePromise } from "./promiseStateHandler";
// import Fuse from "fuse.js";

export const model = {
  welcomeMsg: "Welcome to",
  gameName: "Football Quiz",

  quiz_score: 100,
  quizInput: "",

  playerCallPromiseState: {},

  apiCalls: 0,
  currentUserId: 0,

  // local scores for this user, not actual user objects
  localScores: [],

  // global leaderboard from firebase, used in score page
  globalScores: [],

  // needed so one finished game does not get saved several times
  scoreSaved: false,

  gameHistory: [],

  guesses: [],

  user: undefined,
  ready: false,
  pendingStartQuiz: false,

  nrOfGuesses: 0,
  winStatus: false,

  answer: null,
  isAnswerLoading: false,
  playerImageUrl: null,

  // picks a random player and keeps trying if the api does not find the player
  async setRandomAnswer(prevAnswer) {
    this.isAnswerLoading = true;

    let playerData = null;

    if (!prevAnswer) {
      while (!playerData) {
        const randomIndex = Math.floor(Math.random() * localPlayers.length);
        const randomName = localPlayers[randomIndex];
        // console.log("Chosen player:", randomName); // for debugging

        try {
          const playerPromise = getPlayerByName(randomName);

          // save promise state so the view can show loading/error if needed
          resolvePromise(playerPromise, this.playerCallPromiseState);

          playerData = await playerPromise;

          if (playerData) {
            runInAction(() => {
              this.answer = playerData;
              this.isAnswerLoading = false;
            });
          }
        } catch (error) {
          console.error(
            "API error fetching " + randomName + ", trying another...",
            error
          );
        }
      }
    }
  },

  addGuess(newGuess) {
    this.guesses = [...this.guesses, newGuess];
  },

  incrementNrOfGuesses() {
    this.nrOfGuesses += 1;
  },

  incrementApiCalls() {
    this.apiCalls += 1;
  },

  // the presenter only calls this one function when user guesses
  // then the model handles score, guesses and if the game is finished
  async submitQuizGuess(playerName) {
    this.setQuizInput("");
    this.incrementApiCalls();

    const playerPromise = getPlayerByName(playerName);

    // same promise state is used for suspense/loading in the quiz page
    resolvePromise(playerPromise, this.playerCallPromiseState);

    const playerData = await playerPromise;

    if (!playerData) {
      return null;
    }

    let result;

    runInAction(() => {
      result = this.updateScoreAfterGuess(playerData);
      this.addGuess(playerData);
      this.incrementNrOfGuesses();

      if (result.gameFinished) {
        this.finishGame(playerData);
      }
    });

    return {
      playerData,
      ...result,
    };
  },

  // counts matching clues, this is used to decide how many points to remove
  countCorrectClues(guess) {
    let correctClues = 0;

    if (guess.nationality === this.answer.nationality) {
      correctClues += 1;
    }

    if (guess.league === this.answer.league) {
      correctClues += 1;
    }

    if (Number(guess.age) === Number(this.answer.age)) {
      correctClues += 1;
    }

    if (guess.position === this.answer.position) {
      correctClues += 1;
    }

    if (Number(guess.shirt_num) === Number(this.answer.shirt_num)) {
      correctClues += 1;
    }

    if (guess.team === this.answer.team) {
      correctClues += 1;
    }

    return correctClues;
  },

  isCorrectPlayer(guess) {
    return guess.name === this.answer.name || guess.id === this.answer.id;
  },

  // only calculates and updates score/win/loss, does not save the final game
  updateScoreAfterGuess(guess) {
    const attemptNumber = this.nrOfGuesses + 1;
    const correctPlayer = this.isCorrectPlayer(guess);

    if (correctPlayer) {
      if (attemptNumber === 6 && this.quiz_score < 10) {
        this.quiz_score = 10;
      }

      this.winStatus = true;

      return {
        gameFinished: true,
        won: true,
      };
    }

    if (attemptNumber >= 6) {
      this.quiz_score = 0;
      this.winStatus = false;

      return {
        gameFinished: true,
        won: false,
      };
    }

    const correctClues = this.countCorrectClues(guess);
    const pointsLost = 20 - (correctClues / 6) * 20;

    this.quiz_score = Math.max(0, Math.round(this.quiz_score - pointsLost));

    return {
      gameFinished: false,
      won: false,
    };
  },

  resetScore() {
    this.quiz_score = 100;
  },

  // called only when the game is actually finished
  finishGame(finalGuess) {
    if (this.scoreSaved) {
      return false;
    }

    const userName = this.user?.displayName || this.user?.email || "User";
    const finishedAt = Date.now();

    const finishedGameScore = {
      id: finishedAt,
      username: userName,
      total_score: this.quiz_score,
      createdAt: finishedAt,
    };

    this.localScores = [...this.localScores, finishedGameScore].sort(
      function sortByScoreDescendingACB(a, b) {
        return b.total_score - a.total_score;
      }
    );

    this.gameHistory = [
      ...this.gameHistory,
      {
        id: finishedAt,
        username: userName,
        score: this.quiz_score,
        answer: this.answer,
        guesses: this.guesses,
        // finalGuess ? [...this.guesses, finalGuess] : this.guesses,
        won: this.winStatus,
        createdAt: finishedAt,
      },
    ];

    this.scoreSaved = true;

    return true;
  },

  // printGuesses() {
  //   console.log(this.guesses);
  // },

  setQuizInput(text) {
    this.quizInput = text;
  },

  setWinStatus(gameStatus) {
    this.winStatus = gameStatus;
  },

  startGame() {
    window.location.hash = "/quiz";

    if (!this.answer && this.guesses.length === 0 && !this.winStatus) {
      this.setRandomAnswer();
    }
  },

  // goToMainPage() {
  //   return {
  //     route: "/",
  //   };
  // },

  resetLeaderboard() {
    this.localScores = [];
  },

  setGlobalScores(scores) {
    this.globalScores = Array.isArray(scores) ? scores : [];
  },

  // goToHistoryPage() {
  //   return {
  //     route: "/history",
  //   };
  // },

  clearHistory() {
    this.gameHistory = [];
  },

  setPlayerImageUrl(url) {
    this.playerImageUrl = url;
  },

  // restores the final player picture after login/reload
  // the URL itself is a temporary blob URL, so we recreate it from answer.id
  async ensurePlayerImage() {
    if (
      (this.winStatus || this.nrOfGuesses >= 6) &&
      this.answer?.id &&
      !this.playerImageUrl
    ) {
      const url = await getPlayerImageById(this.answer.id);

      if (url) {
        runInAction(() => {
          this.setPlayerImageUrl(url);
        });
      }
    }
  },

  // restores team logos after login/reload
  // teamLogoUrl is also a temporary blob URL, so we recreate it from teamId
  async ensureTeamLogos() {
    if (!this.guesses?.length) {
      return;
    }

    for (let i = 0; i < this.guesses.length; i++) {
      const guess = this.guesses[i];

      if (guess.teamId && !guess.teamLogoUrl) {
        const url = await getTeamImageById(guess.teamId);

        if (url) {
          runInAction(() => {
            this.updateGuessLogo(i, url);
          });
        }
      }
    }
  },

  updateGuessLogo(index, newUrl) {
    if (this.guesses[index]) {
      const updatedGuesses = [...this.guesses];

      updatedGuesses[index] = {
        ...updatedGuesses[index],
        teamLogoUrl: newUrl,
      };

      this.guesses = updatedGuesses;
    }
  },

  restartGame() {
    this.quizInput = "";
    this.guesses = [];
    this.nrOfGuesses = 0;
    this.winStatus = false;
    this.quiz_score = 100;
    this.scoreSaved = false;
    this.playerImageUrl = null;
    this.answer = null;

    this.setRandomAnswer();

    // return {
    //   route: "/quiz",
    // };
  },

  resetPromiseState() {
    this.playerCallPromiseState = {};
  },
};