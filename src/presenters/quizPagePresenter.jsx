import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { QuizPageView } from "../views/quizPageView";
import { getSuggestions } from "../fuseNames";
import { Navbar } from "./navbarPresenter";

const QuizPage = observer(function QuizPageRender(props) {
  const promiseState = props.model.playerCallPromiseState;

  // this checks if we should show loading/suspense
  const isLoading =
    promiseState.promise && !promiseState.data && !promiseState.error;

  // this side effect asks the model to restore/show the player image after game end
  // presenter no longer calls the external API directly
  useEffect(getImageCB, [
    props.model.winStatus,
    props.model.nrOfGuesses,
    props.model.answer?.id,
    props.model.playerImageUrl,
  ]);

  // this side effect asks the model to restore team logos from saved team ids
  useEffect(getTeamLogosCB, [props.model.guesses.length]);

  function getImageCB() {
    props.model.ensurePlayerImage();
  }

  function getTeamLogosCB() {
    props.model.ensureTeamLogos();
  }

  return (
    <QuizPageView
      answer={props.model.answer}
      text={props.model.quizInput}
      guesses={props.model.guesses}
      nrOfGuesses={props.model.nrOfGuesses}
      winStatus={props.model.winStatus}
      prevGuessPrmsState={promiseState}
      showSuspense={isLoading}
      changeQuizInput={changeQuizInputACB}
      submitGuess={submitGuessACB}
      restartGame={restartGameACB}
      suggestions={getSuggestions(props.model.quizInput, props.model.guesses)}
      playerImageUrl={
        props.model.winStatus || props.model.nrOfGuesses >= 6
          ? props.model.playerImageUrl
          : null
      }
      quiz_score={props.model.quiz_score}
    />
  );

  // presenter asks model to guess
  async function submitGuessACB(playerName) {
    try {
      const result = await props.model.submitQuizGuess(playerName);

      if (!result?.playerData) {
        window.alert(
          "This player is not available in the current API league data.\nPlease select another player."
        );
        props.model.resetPromiseState();
        return;
      }

      if (props.model.winStatus || props.model.nrOfGuesses >= 6) {
        props.model.ensurePlayerImage();
      }
    } catch (err) {
      console.error("Error communicating with data source: ", err);
    }
  }

  function changeQuizInputACB(playerName) {
    props.model.setQuizInput(playerName);
  }

  function restartGameACB() {
    props.model.restartGame();
  }
});

export { Navbar, QuizPage };