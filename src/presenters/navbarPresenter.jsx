// Based on original TW code we got before any assignment was completed
import { observer } from "mobx-react-lite";
import { NavbarView } from "../views/navbarView";
import { useLocation } from "react-router-dom";
import { logoutUser } from "../authSource";

const Navbar = observer(function navbarRender(props) {
  const location = useLocation();

  return (
    <NavbarView
      user={props.user}
      logout={goBackACB}
      goToMainPage={goToMainPageACB}
      goToQuiz={goToQuizACB}
      goToScores={goToScoresACB}
      goToHistory={goToHistoryACB}
      activePage={location.pathname}
    />
  );

  function goBackACB() {
    logoutUser().catch(console.error);
    window.location.hash = "/";
  }

  function goToMainPageACB() {
    window.location.hash = "/";
  }

  function goToQuizACB() {
    window.location.hash = "/quiz";
  }

  function goToScoresACB() {
    window.location.hash = "/scores";
  }

  function goToHistoryACB() {
    window.location.hash = "/history";
  }
});

export { Navbar };