import "../styles/styleHistory.css";
import "../styles/styleShared.css";
import { sortTopScorers, formatTime } from "/src/utils";
export function HistoryPageView(props){
    return (
        <div className="history-page-container">
            <h2 className="section-title">Game History</h2>

            {props.gameHistory.length === 0 ? (
                <div className="empty-history">
                    <p>No finished games yet.</p>
                </div>
            ) : (
                <div className="history-feed">
                    {[...props.gameHistory].reverse().map(renderHistoryCB)}
                </div>
            )}
        </div>
    );

    function renderHistoryCB(game, index){
        const isWin = game.won;
        
        return (
            <div key={`${game.id} - ${index}`} className="history-game-card">
                <div className="history-card-header">
                    <div className="history-time">{formatTime(game.createdAt)}</div>
                    <div className={`history-badge ${isWin ? "badge-win" : "badge-loss"}`}>
                        {isWin ? "Victory" : "Defeat"}
                    </div>
                </div>

                <div className="history-card-body">
                    <div className="history-stat">
                        <span className="stat-label">Score</span>
                        <span className="stat-value score-text-large">{game.score}</span>
                    </div>
                    <div className="history-stat">
                        <span className="stat-label">Correct Answer</span>
                        <span className="stat-value answer-text">{game.answer.name}</span>
                    </div>
                </div>

                <div className="history-guesses-section">
                    <h3 className="guesses-title">Your Guesses ({game.guesses.length})</h3>
                    <div className="history-guesses-list">
                        {game.guesses.map(renderGuessCB)}
                    </div>
                </div>
            </div>
        );
    }

    function renderGuessCB(guess, index){
        return (
            <div key={`${guess.id} - ${index}`} className="history-guess-pill">
                <span className="guess-number">{index + 1}.</span> {guess.name}
            </div>
        );
    }

    
}