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

        console.error("Erro de login:", erro);
        alert("Email ou senha inválidos");

    }

};

/*
 * Controle de acesso
 */
onAuthStateChanged(auth, (user) => {

    const loginArea = document.getElementById("login-area");
    const playerArea = document.getElementById("player-area");

    if (user) {

        loginArea.style.display = "none";
        playerArea.style.display = "block";

    } else {

        loginArea.style.display = "block";
        playerArea.style.display = "none";

    }

});

// Funções Esqueci a Senha

import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js"; // Ajuste conforme sua versão

window.forgotPassword = function(e) {
    e.preventDefault();
    const emailField = document.getElementById('email').value.trim();
    
    if (!emailField) {
        alert("Por favor, digite seu e-mail no campo de login acima para recuperar a senha.");
        return;
    }

    sendPasswordResetEmail(auth, emailField)
        .then(() => {
            alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        })
        .catch((error) => {
            alert("Erro ao enviar e-mail: " + error.message);
        });
}
