import { sortTopScorers, sortLocal, formatTime } from "/src/utils";
// import "/src/style.css";
import "../styles/styleScore.css";
import "../styles/styleShared.css";
export function ScorePageView(props) {
    const topThreeGlobal = props.globalScores.slice(0, 3);
    const restOfGlobal = props.globalScores.slice(3);
    // const topLocalUsers = sortTopScorers(props.localScores).slice(0, 5);
    
    const topLocalUsers = sortLocal(props.localScores);

    return (
        <div className="leaderboard-container">
            <h2 className="section-title">Global Top Players</h2>
            <div className="podium-section">
                {topThreeGlobal[1] && renderPodiumCard(topThreeGlobal[1], 2)}
                {topThreeGlobal[0] && renderPodiumCard(topThreeGlobal[0], 1)}
                {topThreeGlobal[2] && renderPodiumCard(topThreeGlobal[2], 3)}
            </div>

            {restOfGlobal.length > 0 && (
                <div className="table-container scrollable-container">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Score</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restOfGlobal.map(globalScoreRowCB)}
                        </tbody>
                    </table>
                </div>
            )}

            <h2 className="section-title local-title">Your Top 5</h2>
            <div className="table-container">
                <table className="leaderboard-table local-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topLocalUsers.map(localScoreRowCB)}
                    </tbody>
                </table>
                <div className="leaderboard-actions">
                    <button onClick={props.resetLeaderboard} className="leaderboard-reset-btn">Reset Leaderboard</button>
                </div>
            </div>
        </div>
    );


    function globalScoreRowCB(user, index) {
        return renderTableRow(user, index + 4, false); 
    }

    function localScoreRowCB(user, index) {
        return renderTableRow(user, index + 1, true);
    }


    function renderTableRow(user, rank, isLocal) {
        return (
            <tr key={user.id || `${isLocal ? 'local' : 'global'}-${rank}`}>
                <td className="rank-cell">{rank}</td>
                <td className="user-info-cell">
                <span className="user-name">{user.username}</span>
            </td>
                <td className="score-cell">{user.total_score} pts</td>
                <td className="time-cell">{formatTime(user.createdAt)}</td>
            </tr>
        );
    }

    function renderPodiumCard(user, rank) {
        let rankClass = "rank-three";
        let avatarClass = "avatar-bronze";
        let pedestalClass = "pedestal-side";
        let trophyIcon = "🥉 3rd";
        let scoreClass = "score-text";
        let iconColorClass = "bronze";

        if (rank === 1) {
            rankClass = "rank-one";
            avatarClass = "avatar-gold";
            pedestalClass = "pedestal-center";
            trophyIcon = "🏆 1st";
            scoreClass = "score-text-large";
            iconColorClass = "gold";
        } else if (rank === 2) {
            rankClass = "rank-two";
            avatarClass = "avatar-silver";
            trophyIcon = "🥈 2nd";
            iconColorClass = "silver";
        }

        return (
            <div className={`podium-card ${rankClass}`} key={user.id || `rank-${rank}`}>
                <h2 className="podium-name">{user.username}</h2>
                <div className={`pedestal ${pedestalClass}`}>
                    <div className={`trophy-icon ${iconColorClass}`}>{trophyIcon}</div>
                    <div className={scoreClass}>{user.total_score}</div>
                    <div className="points-label">Points</div>
                    <div className="date-text">{formatTime(user.createdAt)}</div>
                </div>
            </div>
        );
    }
    

}