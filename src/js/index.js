import { getAccessToken } from "./apiRequest.js";

const guessInput = document.getElementById("guess-input");

// Initialize variables
let accessToken = "";
let playlistTracks = [];
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
  const trackUrl = `https://open.spotify.com/embed/track/${currentTrack.id}?autoplay=1`;
  document.getElementById("song-iframe").src = trackUrl;
  guessInput.value = "";

  // setTimeout(() => {
  //   document.getElementById("song-iframe").src = "";
  // }, 10000);
}

window.addEventListener("load", function () {
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
  document
    .getElementById("next-song-button")
    .addEventListener("click", nextSong);
});

let hintClickCount = 0;

const hintButton = document.getElementById("hint");
hintButton.addEventListener("click", handleHintClick);

function handleHintClick() {
  if (hintClickCount === 0) {
    document.getElementById("cover-blur").classList.add("hideBlur2");
  } else if (hintClickCount === 1) {
    document.getElementById("artist-blur").classList.add("hideBlur1");
  } else if (hintClickCount === 2) {
    document.getElementById("track-blur").classList.add("hideBlur");
  }
}

let nextClickCount = 0;

const nextButton = document.getElementById("next-song-button");
nextButton.addEventListener("click", handleNextClick);

function handleNextClick() {
  if (nextClickCount === 0) {
    document.getElementById("cover-blur").classList.remove("hideBlur2");
    document.getElementById("artist-blur").classList.remove("hideBlur1");
    document.getElementById("track-blur").classList.remove("hideBlur");
  }
}
