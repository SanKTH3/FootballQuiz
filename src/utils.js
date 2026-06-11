// checkout function again later
export function sortByScoreCB(userA, userB){
    // rank users by score
    const scoreDiff = userA.totalScore-userB.totalScore
    // if scores are different from each other, perform sort based on score_diff
     // IMPORTANT! Typically if score_diff<0 we return -1 and if score_diff>0 we return 1 but now
    // we do it in reverse because we want to have the reverse order
   
    if(scoreDiff<0){
        return 1
    }
    
    if(scoreDiff>0){
        return -1
    }
    // otherwise check which name comes first alphabetically
    // if(userA.username < userB.username){
    //     return -1
    // }
    // if(userA.username > userB.username){
    //     return 1
    // }
    // if neither score or name is different, return 0
    return 0
}


export function sortTopScorers(users){
   return [...users].sort(sortByScoreCB).slice(0,5);

}


export function sortLocalCB(scoreA, scoreB){
    return scoreB.total_score - scoreA.total_score
} 

export function sortLocal(localScores){
return [...localScores].sort(sortLocalCB).slice(0,5);}




// for quizpageview
/*export  function getFlagEmoji(countryCode, name) {
    if (!countryCode) return "";
    if (name === "England") return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
    if (name === "Scotland") return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
    if (name === "Wales") return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
    if (name === "Northern Ireland") return "🇬🇧" ;
    function charToCodePointCB(char) {
      return 127397 + char.charCodeAt();
    }

    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map(charToCodePointCB);

    return String.fromCodePoint(...codePoints);
  }*/

  // used ins scores and history views
  export function formatTime(timestamp) {
        if (!timestamp) return "-";
        
        const date = new Date(timestamp);
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        
        return hours + ":" + minutes + " - " + day + "/" + month + "/" + year;
    }