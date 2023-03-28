import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";
import { getAccessToken } from "./apiRequest";

const guessInput = document.getElementById("guess-input");

// Initialize variables
let accessToken = "";
let playlistTracks = [];
let currentTrackIndex = -1;
let score = 0;

// Load playlist when button is clicked
async function loadPlaylist() {
  accessToken = document.getElementById("access-token-input").value;

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
  if (guess === correctAnswer) {
    score++;
    document.getElementById("score").textContent = score;
    alert("Correct!");
  } else {
    alert("Incorrect. Try again!");
  }
}

// Load and display the next song in the playlist
function nextSong() {
  currentTrackIndex++;
  if (currentTrackIndex >= playlistTracks.length) {
    currentTrackIndex = 0;
  }
  const currentTrack = playlistTracks[currentTrackIndex];
  const trackUrl = `https://open.spotify.com/embed/track/${currentTrack.id}`;
  document.getElementById("song-iframe").src = trackUrl;
  guessInput.value = "";
}

window.addEventListener("load", function () {
  document
    .getElementById("load-playlist-button")
    .addEventListener("click", loadPlaylist);
  document
    .getElementById("submit-guess-button")
    .addEventListener("click", submitGuess);
  document
    .getElementById("next-song-button")
    .addEventListener("click", nextSong);
});
