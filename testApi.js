
const API_KEY = process.env.VITE_FOOTBALL_API_KEY;
console.log("API Key loaded:", API_KEY ? "yes" : "NO");

const BASE_URL = "https://v3.football.api-sports.io/";
const opts = {
    method: "GET",
    headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": API_KEY,
    },
};

// Test: search "Salah" in Premier League (league=39), season=2024
const url = `${BASE_URL}players?search=Salah&season=2024&league=39`;
console.log("URL:", url);

fetch(url, opts)
    .then(r => r.json())
    .then(data => {
        if (data.errors && Object.keys(data.errors).length > 0) {
            console.log("ERRORS:", JSON.stringify(data.errors));
        }
        console.log("Results count:", data.results);
        if (data.response && data.response.length > 0) {
            const p = data.response[0];
            console.log("Player found:", p.player.name);
            console.log("Nationality:", p.player.nationality);
            console.log("Age:", p.player.age);
            const s = p.statistics[0];
            console.log("League:", s?.league?.name);
            console.log("Team:", s?.team?.name);
            console.log("Position:", s?.games?.position);
            console.log("Shirt:", s?.games?.number);
        } else {
            console.log("Empty response. Full data:", JSON.stringify(data));
        }
    })
    .catch(e => console.error("Fetch failed:", e));
