// lightmode script
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
}

// anti right-click protection
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

var ul = document.getElementById("results");

var isRepeat = false; // Flag para indicar se a repetição está ativada

// Adiciona o evento de clique ao botão de repetição
document.getElementById('repeatButton').addEventListener('click', function() {
    isRepeat = !isRepeat;
    this.textContent = isRepeat ? 'Repeat On' : 'Repeat Off'; // Atualiza o texto do botão
});

for (var i = 0; i < data.length; i++) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#";
    a.onclick = function (index) {
        return function() {
            changeAudioSource(index);
        };
    }(i);
    a.textContent = data[i].title;
    li.appendChild(a);
    ul.appendChild(li);
    li.style.display = "none";
}

function changeAudioSource(index) {
    var audio = document.getElementById('audioPlayer');
    var source = document.getElementById('audioSource');

    source.src = data[index].url;
    audio.load();
    audio.play();
    displayCurrentSongTitle(data[index].title);
    playedTracks.push(index); // Adiciona o índice da música ao histórico
}

function search() {
    var input = document.getElementById("search");
    var filter = normalizeString(input.value.toUpperCase());
    var ul = document.getElementById("results");
    var li = ul.getElementsByTagName("li");

    for (var i = 0; i < li.length; i++) {
        var a = li[i].getElementsByTagName("a")[0];
        var txtValue = normalizeString(a.textContent || a.innerText);

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }

    if (filter.length == 0) {
        ul.style.display = "none";
    } else {
        ul.style.display = "block";
    }
}

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ç/g, 'c').replace(/Ç/g, 'C');
}

// Atualiza o título da aba do navegador com apenas o título da música
function updateTabTitle(title) {
    var songTitle = title.split(" - ")[1] || title; // Extrai o título após o " - "
    document.title = `Orbit Player - ${songTitle}`;
}

function displayCurrentSongTitle(title) {
    var tituloMusica = document.getElementById("tituloMusica");
    tituloMusica.textContent = title;
    
    var artist = title.split(" - ")[0];
    var songTitle = title.split(" - ")[1];
    var artworkUrl = 'img/orbit_ico.png'; // Substitua com o caminho da sua imagem de logo

    updateTabTitle(title); // Atualiza o título da aba

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songTitle,
            artist: artist,
            artwork: [
                { src: artworkUrl, sizes: '96x96', type: 'image/png' },
                { src: artworkUrl, sizes: '128x128', type: 'image/png' },
                { src: artworkUrl, sizes: '192x192', type: 'image/png' },
                { src: artworkUrl, sizes: '256x256', type: 'image/png' },
                { src: artworkUrl, sizes: '384x384', type: 'image/png' },
                { src: artworkUrl, sizes: '512x512', type: 'image/png' },
            ]
        });
    }
}

// Script de reprodução aleatória
var audioPlayer = document.getElementById('audioPlayer');
var audioSource = document.getElementById('audioSource');

var recentTracks = []; // Histórico das últimas músicas tocadas
var playedTracks = []; // Histórico de músicas já tocadas na sessão

function getRandomTrack() {
    var randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * data.length);
    } while (recentTracks.includes(randomIndex));
    recentTracks.push(randomIndex);
    if (recentTracks.length > 3) {
        recentTracks.shift();
    }
    return data[randomIndex];
}

function playRandom() {
    var randomTrack = getRandomTrack();
    audioSource.src = randomTrack.url;
    audioPlayer.load();
    audioPlayer.play();
    displayCurrentSongTitle(randomTrack.title);
    playedTracks.push(randomTrack); // Armazena o objeto da música no histórico
}

function skipSong() {
    playRandom();
}

function prevSong() {
    if (playedTracks.length > 1) {
        playedTracks.pop(); // Remove a música atual do histórico
        var previousTrack = playedTracks[playedTracks.length - 1]; // Obtém a música anterior
        audioSource.src = previousTrack.url;
        audioPlayer.load();
        audioPlayer.play();
        displayCurrentSongTitle(previousTrack.title);
    }
}

function formatSongTitle(title) {
    // Lista de palavras que devem permanecer em minúsculas, exceto se forem a primeira ou última palavra
    const exceptions = ['a', 'o', 'e', 'de', 'do', 'da', 'em', 'no', 'na', 'com', 'se', 'que'];

    return title
        .toLowerCase()
        .split(' ')
        .map((word, index, array) => {
            // Mantém a primeira e a última palavra sempre capitalizada
            if (index === 0 || index === array.length - 1) {
                return capitalizeWord(word);
            }
            // Palavras que não estão nas exceções são capitalizadas
            if (!exceptions.includes(word)) {
                return capitalizeWord(word);
            }
            // Palavras de exceção são mantidas minúsculas
            return word;
        })
        .join(' ');
}

function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Aplicação da função para os títulos das músicas
data.forEach((track, index) => {
    data[index].title = formatSongTitle(track.title);
});

// Exemplo de utilização
console.log(data.map(track => track.title));

if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => {
        audioPlayer.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        audioPlayer.pause();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        prevSong();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
        skipSong();
    });

    // Define metadados inicialmente
    displayCurrentSongTitle(data[0].title);
}

// Evento para detectar se a música está prestes a terminar
audioPlayer.addEventListener('timeupdate', function() {
    if (isRepeat && audioPlayer.duration - audioPlayer.currentTime <= 0.25) {
        audioPlayer.currentTime = 0; // Reseta o tempo da música para o início
        audioPlayer.play(); // Reproduz novamente a música atual
    }
});

// Evento para detectar o fim da música e agir conforme a repetição ou reprodução aleatória
audioPlayer.addEventListener('ended', function() {
    if (!isRepeat) {
        playRandom(); // Passa para a próxima música aleatória
    }
});

// Inicie a reprodução com a primeira música aleatória
playRandom();
