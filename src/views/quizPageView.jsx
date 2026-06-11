import React from "react";
import Select from "react-select";
import { SuspenseView } from "../views/suspenseView";
//import { getFlagEmoji } from "../utils";
import "../styles/styleQuiz.css";
import "../styles/styleShared.css";

export function QuizPageView(props) {
  return (
    <div className="quizPage">
      <div className="quiz-layout-container">
        {/* LEFT PANEL:  maybe lik 20%, player card, points etc */}
        <div className="left-panel-card">
          <div className="lheader">
            <h3>GUESS THE FOOTBALLER</h3>
          </div>

          {/* Blurred Photo Card */}
          <div
            className={`player-photo-card ${
              props.playerImageUrl ? "revealed" : "blurred"
            }`}
          >
            {props.playerImageUrl ? (
              <img
                src={props.playerImageUrl}
                alt="Mystery Player"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "inherit",
                }}
              />
            ) : (
              <span>?</span>
            )}
          </div>

          <div className="quiz-actions-row">
            <div className="points-orb-container">
              <div
                className="points-ring"
                style={{ "--score": props.quiz_score }}
              >
                <div className="points-inner-content">
                  <span className="orb-label">PTS</span>
                  <span className="orb-value">{props.quiz_score}</span>
                </div>
              </div>
            </div>

            <button onClick={props.restartGame} className="play-again-btn">
              RESTART
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: 70%  of screen guesses and match input */}
        <div className="right-panel-guesses">
          <div className="guess-tracker-header">
            <div className="progress-bars">
              {[...Array(6)].map(renderProgressDotCB)}
            </div>
            <div className="guesses-left-text">{6 - guessesLeft()} / 6</div>
          </div>

          <div className="input-section">{renderInputField()}</div>
          <div className="guesses-container">{suspenseOrGuesses()}</div>
        </div>
      </div>
    </div>
  );

  /*Functions*/
  function display_question() {
    return "Can you guess the football player?";
  }

  // Renders Suspense if loading, otherwise render list
  function suspenseOrGuesses() {
    if (props.guesses && props.guesses.length > 0) {
      // return [...props.guesses].slice().map(renderGuessReverseCB); // no reversing
      return [...props.guesses].slice().reverse().map(renderGuessReverseCB);
    }

    return null;
  }

  function renderInputField() {
    if (guessesLeft() > 0 && props.winStatus === false) {
      const options = (props.suggestions || []).map(function playerToOptionCB(
        name
      ) {
        return {
          value: name,
          label: name,
        };
      });

      return (
        <div className="search-and-spinner-row">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>

            {/* react-select is our user-visible third-party component */}
            <Select
              options={options}
              placeholder="GUESS A PLAYER..."
              value={null}
              onChange={selectSuggestionACB}
              onInputChange={handleSelectInputChangeACB}
              isDisabled={props.showSuspense}
              className="player-select"
              classNamePrefix="player-select"
              noOptionsMessage={noOptionsMessageCB}
            />

            <div className="input-action-container">
              {props.showSuspense ? (
                <SuspenseView
                  promise={props.prevGuessPrmsState?.promise}
                  error={props.prevGuessPrmsState?.error}
                />
              ) : (
                <span className="enter-icon">↵</span>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      if (props.winStatus === true) {
        const tries = props.guesses ? props.guesses.length : 0;
        return (
          <GameEndBanner
            isVictory={true}
            tries={tries}
            onRestart={props.restartGame}
          />
        );
      } else {
        const finalAnswer = props.answer?.name || "Unknown";
        return (
          <GameEndBanner
            isVictory={false}
            correctAnswer={finalAnswer}
            onRestart={props.restartGame}
          />
        );
      }
    }
  }

  function handleSelectInputChangeACB(inputValue, actionMeta) {
    if (actionMeta.action === "input-change") {
      props.changeQuizInput(inputValue);
    }
  }

  function noOptionsMessageCB() {
    return "No matching player";
  }

  function selectSuggestionACB(selectedOption) {
    if (!selectedOption) return;
    if (guessesLeft() <= 0 || props.winStatus) return;

    props.submitGuess(selectedOption.value);
  }

  function renderGuessCB(guess, index) {
    const total = props.guesses.length;

    const checkLeague =
      guess.league === props.answer.league
        ? "correct_property"
        : "wrong_property";
    const checkNat =
      guess.nationality === props.answer.nationality
        ? "correct_property"
        : "wrong_property";
    const checkTeam =
      guess.team === props.answer.team ? "correct_property" : "wrong_property";
    const checkPos =
      guess.position === props.answer.position
        ? "correct_property"
        : "wrong_property";
    const checkAge =
      Number(guess.age) === Number(props.answer.age)
        ? "correct_property"
        : "wrong_property";
    const checkShirt =
      Number(guess.shirt_num) === Number(props.answer.shirt_num)
        ? "correct_property"
        : "wrong_property";
    const isCorrectGuess = guess.name === props.answer.name;

    return (
      <div
        // key={`${guess.id} - ${index}`}
        key={guess.id}
        className={`guess_box ${isCorrectGuess ? "correct-guess-glow" : ""}`}
      >
        <div className="guessed-name-header">
          <span className="guess-number">
            #{String(total - index).padStart(2, "0")}
          </span>
          <span className="guessed-name">{guess.name.toUpperCase()}</span>
        </div>
        <div className="guess-attributes">
          <div className={`attr-box ${checkLeague}`}>
            <span>LEAGUE</span>
            <strong>{guess.league}</strong>
          </div>
          <div className={`attr-box ${checkNat}`}>
            <span>NAT.</span>
            <strong>
              {guess.nationality}{" "}
              {/*getFlagEmoji(guess.countryCode,guess.nationality)*/}
            </strong>
          </div>
          <div className={`attr-box ${checkTeam}`}>
            <span>TEAM</span>
            <strong>
              {guess.team}
              {/* {guess.teamLogoUrl && (<img
                  src={guess.teamLogoUrl}
                  alt={`${guess.team} logo`}
                  style={{ width: "20px", height: "20px", marginRight: "6px", verticalAlign: "middle" }}
                />
              )}  */}
            </strong>
          </div>
          <div className={`attr-box ${checkPos}`}>
            <span>POS</span>
            <strong>{guess.position}</strong>
          </div>
          <div className={`attr-box ${checkAge}`}>
            <span>AGE</span>
            <strong>
              {guess.age}
              {numberHint(guess.age, props.answer.age)}
            </strong>
          </div>
          <div className={`attr-box ${checkShirt}`}>
            <span>NO.</span>
            <strong>
              {guess.shirt_num}
              {numberHint(guess.shirt_num, props.answer.shirt_num)}
            </strong>
          </div>
        </div>
      </div>
    );
  }

  function numberHint(guessValue, answerValue) {
    const guessNumber = Number(guessValue);
    const answerNumber = Number(answerValue);
    if (Number.isNaN(guessNumber) || Number.isNaN(answerNumber)) {
      return null;
    }
    if (guessNumber < answerNumber) {
      return <span className="hint-arrow up"></span>;
    }
    if (guessNumber > answerNumber) {
      return <span className="hint-arrow down"></span>;
    }
    return null;
    /*︽  ︾*/
  }

  function guessesLeft() {
    return 6 - (props.guesses ? props.guesses.length : 0);
  }

  function renderGuessReverseCB(guess, index) {
    return renderGuessCB(guess, index);
  }

  function renderProgressDotCB(_, i) {
    var guessCount = props.guesses ? props.guesses.length : 0;

    return (
      <div
        key={i}
        className={"progress-dot " + (i < guessCount ? "filled" : "")}
      ></div>
    );
  }

  function GameEndBanner({ isVictory, tries, correctAnswer, onRestart }) {
    const themeClass = isVictory ? "victory" : "failure";
    const title = isVictory ? `CRACKED IT IN ${tries}` : "SORRY, YOU LOST";
    const subtitle = isVictory
      ? "Well Done!"
      : `Correct player: ${correctAnswer.toUpperCase()}`;

    return (
      <div className={`${themeClass}-banner`}>
        <div className={`${themeClass}-info`}>
          {isVictory ? (
            <svg
              className="victory-trophy"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          ) : (
            <svg
              className="failure-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          )}

          <div className={`${themeClass}-text-group`}>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>

        <button className={`play-again-btn ${themeClass}`} onClick={onRestart}>
          PLAY AGAIN
        </button>
      </div>
    );
  }
}