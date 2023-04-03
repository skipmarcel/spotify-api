import { getAccessToken } from "./js/apiRequest.js";
import "./css/styles.css";

const guessInput = document.getElementById("guess-input");

// Initialize variables
let accessToken = "";
let playlistTracks = [];
let playedIndices = [];
let currentTrackIndex = -1;
let score = 0;

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
  if (submitClickCount === 9) {
    alert(`Game Over! Your score is ${score}.`);
    document.getElementById("scores").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden");
  } else if (guess === correctAnswer) {
    if (hintClickCount === 0) {
      score += 3;
    } else if (hintClickCount === 1) {
      score += 2;
    } else if (hintClickCount === 2) {
      score += 1;
    } else if (hintClickCount >= 3) {
      score += 0;
    }
    document.getElementById("score").textContent = score;
    alert("Correct!");
    nextSong();
  } else {
    alert("Incorrect. Try again!");
    nextSong();
  }
  // console.log(hintClickCount);
  hintClickCount = 0;
  handleSubmitClick();
}

// function displayTopScores() {
//   let topScores = document.getElementById("topScores");
//   let scores = JSON.parse(localStorage.getItem("highscores")) || [];
//   scores.sort((a, b) => b.score - a.score);
//   let top10Scores = scores.slice(0, 10);

//   let scoreList = document.createElement("ol");
//   top10Scores.forEach((score) => {
//     let listItem = document.createElement("li");
//     listItem.textContent = `${score.name}: ${score.score}`;
//     scoreList.appendChild(listItem);
//   });

//   topScores.innerHTML = "";
//   topScores.appendChild(scoreList);
// }

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

function runApp() {
  let names = document.getElementById("submitNames");

  names.addEventListener("click", () => {
    event.preventDefault();
    document.getElementById("game").hidden = false;
    document.getElementById("playerNames").hidden = true;
  });

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
    .getElementById("submit-guess-button")
    .addEventListener("click", submitGuess);
  // document
  //   .getElementById("next-song-button")
  //   .addEventListener("click", nextSong);
  // hintButton.addEventListener("click", handleHintClick);
}

window.addEventListener("load", runApp);

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

const submitButton = document.getElementById("submit-guess-button");
submitButton.addEventListener("click", submitGuess);

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
