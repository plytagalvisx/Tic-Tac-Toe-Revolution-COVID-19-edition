# Tic-Tac-Toe Revolution: COVID-19 Edition

A React-based twist on the classic Tic-Tac-Toe game with a COVID-19 themed game world, single-player and multiplayer modes, story elements, galleries, skills, inventory, music, and sound effects.

## Live Demo

The game is hosted here:

https://tic-tac-toe-revolution-covid19.web.app/

## Course Context

This project was created as part of the KTH Royal Institute of Technology course **II1309 Projects and Project Methods** in a project group setting. Contributed by:

- Joakim Lundström
- Georgek Aroush
- Jennifer Wang
- Daniel Nyeko Moini

Course page: https://www.kth.se/student/kurser/kurs/II1309?l=en

The course focuses on project development, project methods, teamwork, and building a working prototype within a structured development process.

## About the Project

**Tic-Tac-Toe Revolution: COVID-19 Edition** expands the traditional Tic-Tac-Toe format into a more complete browser game experience. Instead of only placing Xs and Os on a board, the project includes multiple gameplay screens, themed assets, story mode elements, galleries, inventory features, and multiplayer support.

The project is built with React and uses Firebase Hosting for deployment.

## AI Logic

The single-player mode includes different difficulty levels. Easy mode selects random moves, while hard mode uses the minimax algorithm to calculate the best possible move. Medium mode combines both approaches.

## Features

- Classic Tic-Tac-Toe inspired gameplay
- Single-player mode
- Multiplayer mode
- Story mode pages and game progression
- COVID-19 themed characters/items/virus gallery
- Inventory and item system
- Skills gallery
- Music and sound effects
- Styled UI with CSS and Bootstrap/React Bootstrap
- Firebase Hosting configuration

## Tech Stack

- React
- React Router
- JavaScript
- CSS
- Bootstrap / React Bootstrap
- Firebase
- PubNub / PubNub React
- PixiJS
- Jest

## Project Structure

```text
Tic-Tac-Toe-Revolution-COVID-19-edition/
├── public/
├── src/
│   ├── AboutUs/
│   ├── Gallery/
│   ├── Homepage/
│   ├── Images/
│   ├── Inventory/
│   ├── ItemLibrary/
│   ├── Items/
│   ├── Multiplayer/
│   ├── Music/
│   ├── PlaySession/
│   ├── PlayingField/
│   ├── Singleplayer/
│   ├── Skills/
│   ├── Sounds/
│   ├── Sprites/
│   ├── StoryMode/
│   ├── Styles/
│   ├── Testing/
│   ├── ViewPlay/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── firebase.json
├── package.json
├── package-lock.json
├── yarn.lock
├── babel.config.js
├── jest.config.js
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm or Yarn
- Git

Because this project uses older React dependencies and `node-sass`, a newer Node.js version may cause installation issues. If that happens, try using an older Node version compatible with the project dependencies or replace `node-sass` with a modern Sass setup.

### Installation

Clone the repository:

```bash
git clone https://github.com/plytagalvisx/Tic-Tac-Toe-Revolution-COVID-19-edition.git
cd Tic-Tac-Toe-Revolution-COVID-19-edition
```

Install dependencies:

```bash
npm install
```

Or, if you prefer Yarn:

```bash
yarn install
```

## Running the App Locally

Start the development server:

```bash
npm start
```

Or with Yarn:

```bash
yarn start
```

Then open the local development URL shown in your terminal, usually:

```text
http://localhost:3000
```

## Available Scripts

### `npm start`

Runs the app in development mode.

### `npm run build`

Builds the app for production into the `build/` folder.

### `npm test`

Runs the test watcher using Jest.

### `npm run eject`

Ejects the Create React App configuration.

> Note: Ejecting is permanent and usually unnecessary unless you need full control over the build configuration.

## Deployment

The repository includes a `firebase.json` file configured to deploy the production build from the `build/` directory.

To deploy with Firebase Hosting:

```bash
npm run build
firebase deploy
```

You need to be logged in to Firebase CLI and have access to the Firebase project before deploying.

## Possible Improvements

- Add screenshots or GIFs of the gameplay
- Add clearer setup notes for Firebase and PubNub configuration
- Remove unused files such as `.DS_Store`
- Update old dependencies
- Replace `node-sass` with `sass`
- Add more automated tests
- Add a dedicated license file
- Add contributor credits

## Authors

Created by the project collaborators for the Tic-Tac-Toe Revolution: COVID-19 Edition project.

## License

This project is listed as licensed under ISC in `package.json`.
