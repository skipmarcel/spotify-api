import { getAccessToken } from "./js/apiRequest.js";
import "./css/styles.css";

const guessInput = document.getElementById("guess-input");

// Initialize variables
let accessToken = "";
let playlistTracks = [];
let playedIndices = [];
let currentTrackIndex = -1;
let score = 0;
let currentPlayer = 2;
let playerScores = {};

function enterPlayers() {
  let player1 = document.getElementById("player1").value;
  let player2 = document.getElementById("player2").value;

  document.getElementById("playerOneName").innerText = player1;
  document.getElementById("playerTwoName").innerText = player2;
  return { player1: player1, player2: player2 };
}

function turnDisplay() {
  let player1 = document.getElementById("player1").value;
  let player2 = document.getElementById("player2").value;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  if (currentPlayer === 1) {
    document.getElementById("turnName").innerText = player1;
  } else if (currentPlayer === 2) {
    document.getElementById("turnName").innerText = player2;
  }
}

// Load playlist when button is clicked
async function loadPlaylist() {
  accessToken = await getAccessToken();

  fetch("https://api.spotify.com/v1/playlists/0sCbiYB4EZavMKH9gcbh8S/tracks", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(function (response) {
      if (!response.ok) {
        const errorMessage = `${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      playlistTracks = data.items.map((item) => item.track);
      nextSong();
      // const iframeDiv = document.getElementById("iframePlay"); Used to hid song if play button can be figured out.
      // iframeDiv.setAttribute("hidden", true);
    })
    .catch(function (error) {
      return error;
    });
}

// Submit guess when button is clicked
function submitGuess() {
  const currentTrack = playlistTracks[currentTrackIndex];
  const guess = guessInput.value.trim().toLowerCase();
  const correctAnswer = currentTrack.name.toLowerCase();
  let player1Score = document.getElementById("player1Score");
  let player2Score = document.getElementById("player2Score");
  let player1 = document.getElementById("player1").value;
  let player2 = document.getElementById("player2").value;
  let currentScore = 0;

  if (submitClickCount === 9) {
    alert(`Game Over! Your score is ${currentScore}.`);
    document.getElementById("scores").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden");
    displayScores();
  } else if (guess === correctAnswer) {
    if (hintClickCount === 0) {
      currentScore = 3;
    } else if (hintClickCount === 1) {
      currentScore = 2;
    } else if (hintClickCount === 2) {
      currentScore = 1;
    } else if (hintClickCount >= 3) {
      currentScore = 0;
    }
    if (currentPlayer === 1) {
      playerScores[player1] = (playerScores[player1] || 0) + currentScore;
      player1Score.textContent = playerScores[player1];
    } else if (currentPlayer === 2) {
      playerScores[player2] = (playerScores[player2] || 0) + currentScore;
      player2Score.textContent = playerScores[player2];
    }
    alert("Correct! Calling next song...");
    nextSong();
    localStorage.setItem("playerScores", JSON.stringify(playerScores));
  } else {
    alert("Incorrect. Try again!");
    nextSong();
  }

  turnDisplay();
  score = 0;
  hintClickCount = 0;
  handleSubmitClick();
}

function displayScores() {
  let scoresList = document.getElementById("scores-list");
  let playerScores = JSON.parse(localStorage.getItem("playerScores")) || {};
  let sortedScores = Object.entries(playerScores)
    .sort(([, score1], [, score2]) => score2 - score1)
    .reduce((sortedObj, [key, value]) => {
      sortedObj[key] = value;
      return sortedObj;
    }, {});
  for (let [playerName, score] of Object.entries(sortedScores)) {
    let li = document.createElement("li");
    li.textContent = `${playerName}: ${score}`;
    scoresList.appendChild(li);
  }
}

// const submitButton = document.getElementById("submit-guess-button");
// submitButton.addEventListener("click", submitGuess);

// Load and display the next song in the playlist
function nextSong() {
  currentTrackIndex = getNextTrackIndex();
  if (currentTrackIndex === -1) {
    alert("All tracks have been played!");
    return;
  }
  const currentTrack = playlistTracks[currentTrackIndex];
  const trackUrl = `https://open.spotify.com/embed/track/${currentTrack.id}?autoplay=1`;
  document.getElementById("song-iframe").src = trackUrl;
  guessInput.value = "";
}

// Get the index of the next track to play
function getNextTrackIndex() {
  if (playedIndices.length === playlistTracks.length) {
    return -1; // All tracks have been played
  }
  let randomIndex = Math.floor(Math.random() * playlistTracks.length);
  while (playedIndices.includes(randomIndex)) {
    randomIndex = Math.floor(Math.random() * playlistTracks.length);
  }
  playedIndices.push(randomIndex);
  return randomIndex;
}

// UI logic mostly

window.addEventListener("load", runApp);

function runApp() {
  let names = document.getElementById("submitNames");

  names.addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("game").hidden = false;
    document.getElementById("playerNames").hidden = true;
  });

  document
    .getElementById("submit-guess-button")
    .addEventListener("click", submitGuess);

  document
    .getElementById("load-playlist-button")
    .addEventListener("click", loadPlaylist);

  document
    .getElementById("load-playlist-button")
    .addEventListener("click", function () {
      document.getElementById("iframePlay").classList.remove("hidden");
      document.getElementById("track-blur").classList.remove("hideBlur");
      document.getElementById("artist-blur").classList.remove("hideBlur1");
      document.getElementById("cover-blur").classList.remove("hideBlur2");
    });

  document
    .getElementById("submitNames")
    .addEventListener("click", enterPlayers);
  document
    .getElementById("load-playlist-button")
    .addEventListener("click", turnDisplay);
  document.getElementById("scores").classList.add("hidden");
}

let hintClickCount = 0;

const hintButton = document.getElementById("hint");
hintButton.addEventListener("click", handleHintClick);

function handleHintClick() {
  hintClickCount++;
  if (hintClickCount === 1) {
    document.getElementById("cover-blur").classList.add("hideBlur2");
  } else if (hintClickCount === 2) {
    document.getElementById("artist-blur").classList.add("hideBlur1");
  } else if (hintClickCount === 3) {
    document.getElementById("track-blur").classList.add("hideBlur");
  }
}

let submitClickCount = 0;

function handleSubmitClick() {
  submitClickCount++;
  document.getElementById("cover-blur").classList.remove("hideBlur2"); //("hideBlur2");
  document.getElementById("artist-blur").classList.remove("hideBlur1"); //("hideBlur1");
  document.getElementById("track-blur").classList.remove("hideBlur"); //("hideBlur");
}

const loadPlaylistButton = document.getElementById("load-playlist-button");

loadPlaylistButton.addEventListener("click", () => {
  loadPlaylistButton.classList.add("hidden");
});
