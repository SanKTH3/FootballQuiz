import { localPlayers } from "./playerNames";
import Fuse from "fuse.js";
let fuse = new Fuse(localPlayers, {
    includeScore: true,
    threshold: 0.4,
})


export function getSuggestions(input, guesses) {
    if (!input || input.trim() === "") return [];

    function extractGuessedNameCB(guess) {
      return guess.name.toLowerCase();
    }

    const guessedNames = (guesses || []).map(extractGuessedNameCB);

    function extractFuseItemCB(result) {
      return result.item;
    }

    function filterUnusedNamesCB(name) {
      return !guessedNames.includes(name.toLowerCase());
    }

    return fuse
      .search(input)
      .map(extractFuseItemCB)
      .filter(filterUnusedNamesCB)
      .slice(0, 5);
    }
      