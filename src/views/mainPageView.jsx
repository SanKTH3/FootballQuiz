// import "/src/style.css";
import "../styles/styleMain.css";
import "../styles/styleShared.css";
import playerHero from "/src/assets/playerheros.png";

export function MainPageView(props){
    return (
        <div className="landing-page quizPage immersive-dark">
            <section className="hero-section split-hero">
                
                <div className="hero-text-content centered-hero-content">
                    <h1 className="main-game-title">
                        GUESS THE <br />
                        <span className="gold-accent">FOOTBALLER.</span>
                    </h1>
                    {/*Triggers the authentication popup and also starts the game, removed (id=authButton) add back if needed after onclick no , after*/}
                    <button className="premium-cta-button" onClick={props.onStart} id="authButton" >
                        <span>{props.user ? "Start Quiz" : "Sign in and Start Quiz"}</span>
                        {props.user && props.user.photoURL && (
                            <img 
                                src={props.user.photoURL} 
                                alt="User Profile" 
                                className="button-profile-pic"
                            />
                        )}
                    </button> 
                </div>

                <div className="hero-image-container-raw">
                    <img src={playerHero} alt="Football Players" className="players-image-large"/>
                </div>
            </section>

            <section className="info-grid clean-cards">
                <div className="info-card minimalist_box">
                    <h3>HOW IT WORKS</h3>
                    <p>
                        Pick a player from the top 5 leagues: Premier League, Serie A, La Liga, Bundesliga, or Ligue 1.
                    </p>
                </div>

                <div className="info-card minimalist_box">
                    <h3>AFTER EACH GUESS</h3>
                    <p>
                        Receive hints in the form of Nationality, League, Club, Position, Age, and Shirt Number.
                    </p>
                </div>

                <div className="info-card minimalist_box">
                    <h3>COLOR HINTS</h3>
                    <p>
                        Correct attributes turn <span className="text-green">Green</span>, incorrect ones turn <span className="text-red">Red</span>.
                    </p>
                </div>

                <div className="info-card minimalist_box">
                    <h3>WINNING & LOSING</h3>
                    <p>
                        Identify the mystery player within 6 guesses to win. If you exceed 6 guesses, you lose!
                    </p>
                </div>
            </section>
        </div>

    );
    function clickStartACB() {
        props.onStart()
    }
}