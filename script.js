


let currentSongIndex = 0;
let audio = new Audio();
let allSongs = [];

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();

    let div = document.createElement('div');
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        if (as[i].href.endsWith(".mp3")) songs.push(as[i].href);
    }

    return songs;
}

async function main() {
    allSongs = await getsongs();
    console.log(allSongs);

    let songul = document.querySelector(".song-list ul");

    // Insert Songs into UI
    for (let song of allSongs) {
        let clean = decodeURIComponent(song);

    // last part (filename)
    clean = clean.split("/").pop();

    // extension hatana
    clean = clean.replace(".mp3", "");

    // "\" hatana
    clean = clean.replace(/\\/g, "");


    clean = clean.replace(/^songs/i,"");

        songul.innerHTML += `
        <li class="songItem" data-src="${song}">
            <div class="dd">
                <img src="assits/music.svg" alt="">
                <div class="info"><div>${clean}</div></div>
            </div>
            <div class="play flex">
                <span>Play</span>
            </div>
        </li>`;
    }

    // Add click on each song
    document.querySelectorAll(".songItem").forEach((item, index) => {
        item.addEventListener("click", () => {
            playSong(index);
        });
    });

    // Bottom controls
    document.getElementById("playBtn").addEventListener("click", togglePlay);
    document.getElementById("nextBtn").addEventListener("click", nextSong);
    document.getElementById("prevBtn").addEventListener("click", prevSong);
    
    document.getElementById("seekbar").addEventListener("input", seekSong);

    loadSong(0);
}

function loadSong(index) {
    currentSongIndex = index;
    audio.src = allSongs[index];
    audio.load();

    audio.addEventListener("loadedmetadata", () => {
        document.getElementById("total-time").innerText = formatTime(audio.duration);
    });
}

function playSong(index) {
    loadSong(index);
    audio.play();
    document.getElementById("playBtn").src = "assits/pause.svg";
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        playBtn.src = "assits/pause.svg";
    } else {
        audio.pause();
        playBtn.src = "assits/play.svg";
    }
}

function nextSong() {
    if (currentSongIndex < allSongs.length - 1) {
        playSong(currentSongIndex + 1);
    }
}

function prevSong() {
    if (currentSongIndex > 0) {
        playSong(currentSongIndex - 1);
    }
}

// SEEK BAR Update
audio.addEventListener("timeupdate", () => {
    let seek = document.getElementById("seekbar");
    seek.value = (audio.currentTime / audio.duration) * 100;

    document.getElementById("current-time").innerText = formatTime(audio.currentTime);
});

// SEEK Draging
function seekSong() {
    audio.currentTime = (seekbar.value / 100) * audio.duration;
}

// Format Time
function formatTime(sec) {
    sec = Math.floor(sec);
    let min = Math.floor(sec / 60);
    let s = sec % 60;
    if (s < 10) s = "0" + s;
    return `${min}:${s}`;
}

main();







