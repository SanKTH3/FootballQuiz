# Football Quiz

Welcome to **Football Quiz** a game where you test your football knowledge by trying to identify the mystery player before your guesses run out.

## About the Game

The game selects a football player from the **top 5 leagues** which include: Premier League, Serie A, La Liga, Bundesliga, and Ligue 1. The goal is to guess who the player is.

After each guess, you receive hints that help you get closer to the correct answer.

## How It Works

### Start Quiz
Start the game and begin guessing the mystery player by writing correctly first **and** last name.

### After Each Guess
Each guess gives you new clues in the form of:

- Nationality
- League
- Shirt number
- Club
- Position
- Age

These hints are meant to guide you toward the correct player.

### Color Hints
The hints uses colors to indicate how correct the answer is:

- **Green** = correct
- **Red** = incorrect

This makes it easier to compare your guesses and narrow down the mystery player.

### Winning and Losing
You have **6 guesses** to find the correct player.

- If you guess the correct player within 6 tries, you **win**
- If you use all 6 guesses without finding the player, you **lose**

<!-- ## Features

- Mystery football player guessing game
- Players selected from the top 5 leagues
- Helpful hint system after every guess
- Color-based feedback
- 6-attempt challenge system
-->
<!-- ## Purpose

This project was created to provide a fun and interactive way for football fans to test their knowledge of players, leagues, and clubs.
-->
# 3rd party components
- React - used for building the UI with components. Used throughout all the .jsx files.
- MobX / mobx-react-lite - used for reactive application state and observer based rendering. Used throughout all the .jsx files.
- Firebase Authentication - used for Google sign-in/sign-out. Used in preetners navbarPresenter.jsx, mainPagePresenter.jsx and googleAuthPresenter.jsx.  
- Firestore/Firebase - used for persistence, leaderboard/history saving, and live updates. Mainly used in Firebase.js
- Fuse.js - used for player search/autocomplete suggestions. Used in file fuseNames.js which was later used py quizPagePresenter.jsx and quizPageView.jsx. 
- Vite

# Project setup

## Environment variables

This project uses Firebase and a football API through RapidAPI. The real `.env` file is intentionally not included in the repository because it contains API keys.

Create your own local environment file by copying the example file:

```bash
cp .env.example .env
```

Then fill in the values in `.env`:

```env
VITE_FOOTBALL_API_KEY=your_rapidapi_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Local setup

- Clone this repo
- Go to the project directory:

```bash
cd "foldername"
```

- Install dependencies:

```bash
npm install
```

- Start the development server:

```bash
npm run dev
```
# File structure and purpose of files
- README.md
files with firebase in their name take care of firebase related tasks
- firebase.json  
- firestore.rules  
- firestore.indexes.json  
- index.html  
- package.json  
- package-lock.json  
- vite.config.js  
- testApi.js

### src/
- GameModel.js, stores important functions and data for game logic. 
- apiConfig.js, initializes API
- fetchPlayers.js, gets all the players that will be rendered in the suggestions
- firebase.js, takes care of intializing firebase
- footballSource.js, calls API and retrieves player information 
- fuseNames.js, uses fuse.js with the players from fetchPlayer.js to generate suggestions
- gamePersistence.js, tajes care of persistance related code
- playerNames.js, stores player names used to 
- promiseStateHandler.js, functions like resolvePromise.js from TW labs
- reactiveModel.js, initializes model
- utils.js, includes some basic functions that are used to more efficiently render information 

For the time being it includes much mock data  

  

All presenters take care of propagating down props to the viws and firing custom events that update the model
### src/presenters/
- ReactRoot.jsx, calls the views we use
- index.jsx , mounts the app
- googleAuthPresenter.jsx
- mainPagePresenter.jsx
- navbarPresenter.jsx
- quizPagePresenter.jsx
- scorePagePresenter.jsx
- historyPagePresenter.jsx
- style.css, takes care of styling
  
### src/assets
- playerheros.png
- logo.svg
### src/views/
- mainPageView.jsx, UI for main page
- quizPageView.jsx , UI for the quiz page 
- scorePageView.jsx, UI for player results
- historyPageView.jsx, UI for displaying all guesses made by player
- navbarPageView.jsx, UI for navigation
- googleAuthView.jsx, U
- suspenseView.jsx, UI for showing suspense

All .css files take care of styling in their appropriate pages
### src/styles/
- styleHistory.css
- styleNavbar.css
- styleScore.css
- styleMain.css
- styleQuiz.css
- styleShared.css
## Team / Authors

Haralampos

Karim

San

Bhavya
