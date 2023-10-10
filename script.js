const songs = [];
let currentSongIndex = 0;

const audio = document.getElementById("audio");
const titleElement = document.getElementById("title");
const playPauseButton = document.getElementById("play-pause");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const songListElement = document.getElementById("song-list");
const volumeControl = document.getElementById("volume-control");
const timeline = document.getElementById("timeline");
const currentTimeElement = document.getElementById("current-time");
const durationElement = document.getElementById("duration");
const fileInput = document.getElementById("file-input");
const uploadButton = document.getElementById("upload-button");
const clearQueueButton = document.getElementById("clear-queue");

clearQueueButton.addEventListener("click", clearQueue);
function clearQueue() {
  songs.length = 0;
  songListElement.innerHTML = "";
  audio.pause();
  audio.src = "";
  titleElement.textContent = "";
  currentTimeElement.textContent = "0:00";
  durationElement.textContent = "0:00";
  timeline.value = 0;
}

fileInput.addEventListener("change", handleFileUpload);
uploadButton.addEventListener("click", uploadSongs);

function handleFileUpload(event) {
  const selectedFiles = event.target.files;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const title = file.name.replace(".mp3", "");
    songs.push({ title, file });
  }
}

function uploadSongs() {
  if (songs.length === 0) {
    alert("Please select one or more songs to upload.");
    return;
  }

  fileInput.value = "";

  songListElement.innerHTML = "";

  currentSongIndex = 0;
  loadSong();
  audio.play();

  songs.forEach((song, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = song.title;
    listItem.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong();
      audio.play();
    });
    songListElement.appendChild(listItem);
  });
}

function loadSong() {
  if (songs.length > 0) {
    const currentSong = songs[currentSongIndex];
    titleElement.textContent = currentSong.title;
    audio.src = URL.createObjectURL(currentSong.file);
  }
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseButton.textContent = "Pause";
  } else {
    audio.pause();
    playPauseButton.textContent = "Play";
  }
}

function playNextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong();
  audio.play();
}

function playPrevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong();
  audio.play();
}

function updateTimeline() {
  const currentTime = audio.currentTime;
  const duration = audio.duration;

  timeline.value = (currentTime / duration) * 100;
}

playPauseButton.addEventListener("click", togglePlayPause);
nextButton.addEventListener("click", playNextSong);
prevButton.addEventListener("click", playPrevSong);

songs.forEach((song, index) => {
  const listItem = document.createElement("li");
  listItem.textContent = song.title;
  listItem.addEventListener("click", () => {
    currentSongIndex = index;
    loadSong();
    audio.play();
  });
  songListElement.appendChild(listItem);
});

loadSong();

audio.volume = volumeControl.value;
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

audio.addEventListener("timeupdate", updateTimeline);
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;

  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);
  const durationMinutes = Math.floor(duration / 60);
  const durationSeconds = Math.floor(duration % 60);

  const currentTimeString = `${currentMinutes}:${
    currentSeconds < 10 ? "0" : ""
  }${currentSeconds}`;
  const durationTimeString = `${durationMinutes}:${
    durationSeconds < 10 ? "0" : ""
  }${durationSeconds}`;

  currentTimeElement.textContent = currentTimeString;
  durationElement.textContent = durationTimeString;
});

timeline.addEventListener("input", () => {
  const percentage = timeline.value;
  const duration = audio.duration;
  const newPosition = (percentage / 100) * duration;
  audio.currentTime = newPosition;
});

audio.addEventListener("ended", () => {
  playNextSong();
});
