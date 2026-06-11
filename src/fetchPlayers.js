import fs from "fs";

const BASE_URL = "https://sportapi7.p.rapidapi.com/api/v1";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "",
    "x-rapidapi-host": "sportapi7.p.rapidapi.com",
    "Content-Type": "application/json",
  },
};

const top5LeagueIds = [1, 36, 42, 33, 4];

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function sleep(ms){
  return new Promise(function trackTimeACB(resolve){
   setTimeout(timerACB, ms)
      function timerACB(){
        resolve()  
      }
  })
}

async function fetchAllPlayers() {
  // console.log("Starting the player data fetch...");
  const allPlayerNames = new Set();

  try {
    for (const leagueId of top5LeagueIds) {
      console.log(`Processing League ID: ${leagueId}`);

      const seasonsResponse = await fetch(
        `${BASE_URL}/tournament/${leagueId}/seasons`,
        options,
      );
      const seasonsData = await seasonsResponse.json();

      if (!seasonsData.seasons || seasonsData.seasons.length === 0) {
        console.log(`No seasons found for league ${leagueId}. Skipping...`);
        continue;
      }
      const currentSeasonId = seasonsData.seasons[0].id;
      console.log(`Found current season ID: ${currentSeasonId}`);
      await sleep(1000); // Rate limit pause

      const standingsResponse = await fetch(
        `${BASE_URL}/tournament/${leagueId}/season/${currentSeasonId}/standings/total`,
        options,
      );
      const standingsData = await standingsResponse.json();

      let teams = [];
      function rowCB(row){
        return row.team
      }
      if (standingsData.standings && standingsData.standings.length > 0) {
        teams = standingsData.standings[0].rows.map(rowCB);
      }

      if (teams.length === 0) {
        console.log(
          `No teams found in standings for league ${leagueId}. Skipping...`,
        );
        continue;
      }

      console.log(`Found ${teams.length} teams. Fetching players...`);

      for (const team of teams) {
        console.log(`  - Fetching players for: ${team.name}`);

        const playersResponse = await fetch(
          `${BASE_URL}/team/${team.id}/players`,
          options,
        );
        const playersData = await playersResponse.json();
        const playersList = playersData.players || [];

        let addedCount = 0;
        for (const item of playersList) {
          if (item.player && item.player.name) {
            allPlayerNames.add(item.player.name);
            addedCount++;
          }
        }
        console.log(`    > Added ${addedCount} players`);

        await sleep(1000);
      }
    }

    // FINISH: Save to file
    const playersArray = Array.from(allPlayerNames);
    const fileContent = `export const localPlayers = ${JSON.stringify(playersArray, null, 4)};\n`;

    fs.writeFileSync("./playerNames.js", fileContent);
    console.log(
      `\n SUCCESS: Saved ${playersArray.length} unique players to ./playerNames.js`,
    );
  } catch (error) {
    console.error("\n Error fetching data:", error);
  }
}

fetchAllPlayers();
