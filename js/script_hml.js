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

// ================= RENDER LISTA =================
function renderList() {
    ul.innerHTML = "";

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
}

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
    if (data.length === 0) return;

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
audioPlayer.addEventListener('ended', () => {
    if (isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        setTimeout(playRandom, 300);
    }
});

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

// ================= VARIÁVEL DE ESTADO =================
var currentGenre = 'all';

// ================= RENDERIZAR FILTROS (Adicione no seu JS) =================
function renderFilters() {
    let container = document.getElementById('category-filters');
    container.innerHTML = '';

    // Mapeia todos os gêneros extraindo o nome da pasta na URL (ex: music/rap/ -> rap)
    let genres = new Set();
    data.forEach(track => {
        let folder = track.url.split('/')[1]; // Pega a segunda parte do caminho
        if (folder) genres.add(folder);
    });

    // Cria o botão "Todos"
    container.appendChild(createFilterButton('Todos', 'all', true));

    // Cria os botões para cada gênero encontrado
    genres.forEach(genre => {
        // Capitaliza a primeira letra (rap -> Rap)
        let genreName = genre.charAt(0).toUpperCase() + genre.slice(1);
        container.appendChild(createFilterButton(genreName, genre, false));
    });
}

function createFilterButton(label, value, isActive) {
    let btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'filter-btn' + (isActive ? ' active' : '');
    
    btn.onclick = function() {
        currentGenre = value;
        
        // Remove a classe 'active' de todos e adiciona no clicado
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Refaz a busca aplicando o novo filtro
        search();
    };
    
    return btn;
}

// ================= ATUALIZAR FUNÇÃO DE BUSCA =================
// Substitua sua função search() atual por esta:
function search() {
    let input = document.getElementById("search");
    let filter = normalizeString(input.value.toUpperCase());
    let li = ul.getElementsByTagName("li");

    let hasVisibleItems = false;

    for (let i = 0; i < data.length; i++) {
        let track = data[i];
        let txt = normalizeString(track.title);
        
        // Verifica o texto
        let matchesText = txt.toUpperCase().includes(filter);
        
        // Verifica a categoria pela URL
        let trackGenre = track.url.split('/')[1];
        let matchesGenre = (currentGenre === 'all' || trackGenre === currentGenre);

        // Só exibe se bater com o texto E com a categoria escolhida
        if (matchesText && matchesGenre) {
            li[i].style.display = "";
            hasVisibleItems = true;
        } else {
            li[i].style.display = "none";
        }
    }

    // Mostra a lista se houver texto digitado OU se um filtro específico estiver ativo
    ul.style.display = (filter.length > 0 || currentGenre !== 'all') ? "block" : "none";
}
