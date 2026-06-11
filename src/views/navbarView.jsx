// import "/src/style.css";
import "../styles/styleNavbar.css";
import "../styles/styleShared.css";
import logo from "/src/assets/logo.svg";

export function NavbarView(props) {
  // Used to call it a callback, but it is not. It is not an argument to a function.
  return (
    <div className="navbar-container">
      <div className="navbar-left" onClick={props.goToMainPage}>
        <img src={logo} className="navbar-logo" />
      </div>

      <div className="navbar-middle">
        {/* Replaced hrefs with onClick events calling your ACBs */}
        <button
          onClick={props.goToQuiz}
          className={`nav-link ${activeClass("/quiz")}`}
        >
          Play
        </button>

        <button
          onClick={props.goToScores}
          className={`nav-link ${activeClass("/scores")}`}
        >
          Leaderboard
        </button>

        <button
          onClick={props.goToHistory}
          className={`nav-link ${activeClass("/history")}`}
        >
          History
        </button>
      </div>

      <div className="navbar-right">
        {props.user && (
          <div className="user-profile-dropdown">
            <div className="dropdown-trigger">
              {props.user.photoURL && (
                <img
                  src={props.user.photoURL}
                  alt="Profile"
                  className="profile-pic"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="greeting">
                Hello, {props.user.displayName || props.user.email}{" "}
                <span className="dropdown-arrow">▼</span>
              </span>
            </div>

            <div className="dropdown-menu">
              <button onClick={props.logout} className="dropdown-logout-btn">
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function activeClass(page) {
    return props.activePage === page ? "active" : "";
  }
}