// ================= LIGHT MODE =================
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
}

// ================= BLOQUEIO CLICK =================
document.addEventListener('contextmenu', e => e.preventDefault());

// ================= ELEMENTOS =================
var ul = document.getElementById("results");
var audioPlayer = document.getElementById('audioPlayer');
var audioSource = document.getElementById('audioSource');

// ================= CONTROLE =================
var isRepeat = false;
var recentTracks = [];
var playedTracks = [];

// ================= BOTÃO REPEAT =================
document.getElementById('repeatButton').addEventListener('click', function () {
    isRepeat = !isRepeat;
    this.textContent = isRepeat ? 'Repeat On' : 'Repeat Off';
});

// ================= LISTA =================
data.forEach((track, i) => {
    let li = document.createElement("li");
    let a = document.createElement("a");

    a.href = "#";
    a.textContent = track.title;
    a.onclick = () => changeAudioSource(i);

    li.appendChild(a);
    ul.appendChild(li);
    li.style.display = "none";
});

// ================= TROCAR MÚSICA =================
function changeAudioSource(index) {

    audioSource.src = data[index].url;
    audioPlayer.load();

    audioPlayer.play().catch(e => {
        console.log("Erro play:", e);
    });

    displayCurrentSongTitle(data[index].title);

    playedTracks.push(data[index]);
}

// ================= BUSCA =================
function search() {
    let input = document.getElementById("search");
    let filter = normalizeString(input.value.toUpperCase());
    let li = ul.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        let txt = normalizeString(li[i].textContent);
        li[i].style.display = txt.toUpperCase().includes(filter) ? "" : "none";
    }

    ul.style.display = filter.length === 0 ? "none" : "block";
}

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// ================= TÍTULO =================
function updateTabTitle(title) {
    let songTitle = title.split(" - ")[1] || title;
    document.title = `Orbit Player - ${songTitle}`;
}

function displayCurrentSongTitle(title) {

    document.getElementById("tituloMusica").textContent = title;

    let artist = title.split(" - ")[0];
    let songTitle = title.split(" - ")[1];

    updateTabTitle(title);

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songTitle,
            artist: artist
        });
    }
}

// ================= RANDOM =================
function getRandomTrack() {
    let index;

    do {
        index = Math.floor(Math.random() * data.length);
    } while (recentTracks.includes(index));

    recentTracks.push(index);
    if (recentTracks.length > 3) recentTracks.shift();

    return data[index];
}

function playRandom() {
    let track = getRandomTrack();

    audioSource.src = track.url;
    audioPlayer.load();

    audioPlayer.play().catch(() => {
        console.log("Aguardando interação...");
    });

    displayCurrentSongTitle(track.title);

    playedTracks.push(track);
}

// ================= CONTROLES =================
function skipSong() {
    playRandom();
}

function prevSong() {
    if (playedTracks.length > 1) {
        playedTracks.pop();
        let prev = playedTracks[playedTracks.length - 1];

        audioSource.src = prev.url;
        audioPlayer.load();
        audioPlayer.play();

        displayCurrentSongTitle(prev.title);
    }
}

// ================= EVENTOS =================

// mantém sessão viva
audioPlayer.addEventListener('play', () => {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = "playing";
    }
});

audioPlayer.addEventListener('pause', () => {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = "paused";
    }
});

// 🔥 REPEAT + RANDOM CORRIGIDO
audioPlayer.addEventListener('ended', () => {

    if (isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        return;
    }

    setTimeout(playRandom, 300);
});

// 🔥 FALLBACK MOBILE
audioPlayer.addEventListener('timeupdate', () => {

    if (!audioPlayer.duration) return;

    let remaining = audioPlayer.duration - audioPlayer.currentTime;

    if (remaining <= 0.3) {

        if (isRepeat) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playRandom();
        }
    }
});

// ================= MEDIA SESSION =================
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('nexttrack', skipSong);
    navigator.mediaSession.setActionHandler('previoustrack', prevSong);
}

// ================= START =================
playRandom();
