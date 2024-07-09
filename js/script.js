<script>
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

    for (var i = 0; i < data.length; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#";
        a.onclick = function (index) {
            return function () {
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
    }

    function search() {
        var input = document.getElementById("search");
        var filter = input.value.toUpperCase();
        var ul = document.getElementById("results");
        var li = ul.getElementsByTagName("li");

        for (var i = 0; i < li.length; i++) {
            var a = li[i].getElementsByTagName("a")[0];
            var txtValue = a.textContent || a.innerText;

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

    function displayCurrentSongTitle(title) {
        var tituloMusica = document.getElementById("tituloMusica");
        tituloMusica.textContent = title;

        var artist = title.split(" - ")[0];
        var songTitle = title.split(" - ")[1];
	var artworkUrl = 'img/orbit_ico.png'; // Substitua com o caminho da sua imagem de logo

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songTitle,
            artist: artist,
            artwork: [
                { src: artworkUrl, sizes: '96x96', type: 'img/orbit_ico.png' },
                { src: artworkUrl, sizes: '128x128', type: 'img/orbit_ico.png' },
                { src: artworkUrl, sizes: '192x192', type: 'img/orbit_ico.png' },
                { src: artworkUrl, sizes: '256x256', type: 'img/orbit_ico.png' },
                { src: artworkUrl, sizes: '384x384', type: 'img/orbit_ico.png' },
                { src: artworkUrl, sizes: '512x512', type: 'img/orbit_ico.png' },
            ]
        });
    }
}

    // Script de reprodução aleatória
    var audioPlayer = document.getElementById('audioPlayer');
    var audioSource = document.getElementById('audioSource');

    function getRandomTrack() {
        var randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    }

    function playRandom() {
        var randomTrack = getRandomTrack();
        audioSource.src = randomTrack.url;
        audioPlayer.load();
        audioPlayer.play();
        displayCurrentSongTitle(randomTrack.title);
    }

    function skipSong() {
        playRandom();
    }

    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
            audioPlayer.play();
        });

        navigator.mediaSession.setActionHandler('pause', () => {
            audioPlayer.pause();
		
        // navigator.mediaSession.setActionHandler('previoustrack', () => {
            // Você pode adicionar funcionalidade de "previoustrack" se necessário
		
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            skipSong();
        });
    }

    audioPlayer.addEventListener('ended', skipSong);

    // Inicie a reprodução com a primeira música aleatória
    playRandom();
</script>
