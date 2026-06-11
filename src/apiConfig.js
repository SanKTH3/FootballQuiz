// SportAPI7 (SofaScore) via RapidAPI
export const BASE_URL = "https://sportapi7.p.rapidapi.com/api/v1";
export const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;

export const options = {
	method: "GET",
	headers: {
		"x-rapidapi-host": "sportapi7.p.rapidapi.com",
		"x-rapidapi-key": API_KEY,
	},
};
