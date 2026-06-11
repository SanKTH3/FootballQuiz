import { observer } from "mobx-react-lite";
import { ScorePageView } from "../views/scorePageView";

const ScorePage = observer(function ScorePageRender(props) {
  function resetLeaderboardACB() {
    props.model.resetLeaderboard();
  }

  return (
    <ScorePageView
      localScores={props.model.localScores}
      globalScores={props.model.globalScores}
      quiz_score={props.model.quiz_score}
      nrOfGuesses={props.model.nrOfGuesses}
      winStatus={props.model.winStatus}
      // goToHistory={goToHistoryACB}
      resetLeaderboard={resetLeaderboardACB}
    />
  );
});

export { ScorePage };