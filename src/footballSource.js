import { BASE_URL, options } from "./apiConfig";

/**
 * Search for a player by name using SportAPI7 (SofaScore via RapidAPI).
 * Endpoint: GET /search/players/{name}/more
 * Then fetches full player details via GET /player/{id}
 */

const TOP_5_LEAGUES = [
  "Premier League",
  "LaLiga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
];

// Map position codes
const positionMap = {
  F: "Attacker",
  M: "Midfielder",
  D: "Defender",
  G: "Goalkeeper",
};

function calculateAge(timestamp) {
  if (!timestamp) return "Unknown";

  const birthDate = new Date(timestamp * 1000);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export async function getPlayerByName(name) {
  try {
    // Step 1: Search for player by name
    const searchUrl = `${BASE_URL}/search/players/${encodeURIComponent(name)}/more`;
    

    const searchResponse = await fetch(searchUrl, options);
    if (!searchResponse.ok) {
      throw new Error(`Search failed: HTTP ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.players || searchData.players.length === 0) {
      console.log("[footballSource] No players found for:", name);
      return null;
    }

    // Step 2: Get the league from the player's team tournament info
    // The search result already contains team and some data, but let's
    // also fetch full details for more complete info
    let exactSelected = null;
    let fallbackSelected = null;

    for (const candidate of searchData.players) {
      try {
        const detailUrl = `${BASE_URL}/player/${candidate.id}`;
        const res = await fetch(detailUrl, options);
        if (!res.ok) continue;

        const data = await res.json();
        const p = data.player;

        const sport = p?.team?.sport?.name;

        const teamId = candidate?.team?.id;
        if (!teamId) continue;

        const tournamentsUrl = `${BASE_URL}/team/${teamId}/unique-tournaments`;

        const tournamentsRes = await fetch(tournamentsUrl, options);
        if (!tournamentsRes.ok) continue;

        const tournamentsData = await tournamentsRes.json();


        function isTopLeagueCB(t) {
          return TOP_5_LEAGUES.includes(t.name);
        }

        const leagueName = tournamentsData?.uniqueTournaments?.find(isTopLeagueCB)?.name;
        if (sport === "Football" && leagueName) {
          const validPlayer = { candidate, details: p, leagueName };

          if (candidate.name.toLowerCase() === name.toLowerCase()) {
            exactSelected = validPlayer;
            break;
          }
          if (!fallbackSelected) {
            fallbackSelected = validPlayer;
          }
        }
      } catch {
        continue;
      }
    }

    const selected = exactSelected || fallbackSelected;
    if (!selected) {
      console.log("[footballSource] No football player in top leagues found");
      return null;
    }

    const { candidate: player, details: p, leagueName } = selected;
    let teamLogoUrl = null;

    if (player.team?.id) {
      teamLogoUrl = await getTeamImageById(player.team.id);
    }
    // format result
    return {
      id: player.id,
      name: player.name,
      nationality: player.country?.name || "Unknown",
      countryCode: player.country?.alpha2,
      age: calculateAge(p?.dateOfBirthTimestamp),
      league: leagueName,
      team: p?.team?.name || "Unknown",
      teamId: player.team?.id,
      teamLogoUrl: teamLogoUrl,
      position: positionMap[player.position] || player.position || "Unknown",
      shirt_num: player.jerseyNumber || "Unknown",
    };
  } catch (err) {
    console.error("[footballSource] Error:", err.message);
    throw err;
  }
}


async function fetchImageAsUrl(url) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob(); 
    return URL.createObjectURL(blob); 
    
  } catch (err) {
    console.error("[footballSource] Image fetch error:", err);
    return null;
  }
}

export async function getPlayerImageById(id) {
  const url = `${BASE_URL}/player/${id}/image`;
  return fetchImageAsUrl(url);
}

export async function getTeamImageById(teamId) {
  const url = `${BASE_URL}/team/${teamId}/image`;
  return fetchImageAsUrl(url);
}