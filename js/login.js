import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

/*
 * Função chamada pelo botão Entrar
 */
window.login = async function () {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            senha
        );

    } catch (erro) {

        console.error(erro);
        alert("Email ou senha inválidos");

    }

};

/*
 * Carrega músicas somente após autenticação
 */
function carregarPlayer() {

    fetch("music_map.txt")
        .then(response => response.json())
        .then(json => {

            window.data = json;

            console.log("Músicas carregadas:", json);

            renderList();
            playRandom();

        })
        .catch(error => {

            console.error("Erro ao carregar músicas:", error);

        });

}

/*
 * Verifica login
 */
onAuthStateChanged(auth, (user) => {

    const loginArea = document.getElementById("login-area");
    const playerArea = document.getElementById("player-area");

    if (user) {

        loginArea.style.display = "none";
        playerArea.style.display = "block";

        carregarPlayer();

    } else {

        loginArea.style.display = "block";
        playerArea.style.display = "none";

    }

});