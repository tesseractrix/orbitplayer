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

import { 
    sendPasswordResetEmail, 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";
import { 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

// ================= ESQUECI A SENHA =================
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
};

// ================= FUNÇÃO DE CADASTRO COM APROVAÇÃO =================
window.registerUser = async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!email || !senha) {
        alert("Preencha o e-mail e a senha desejada para se cadastrar.");
        return;
    }

    try {
        // 1. Cria a conta no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const uid = userCredential.user.uid;

        // 2. Salva no Firestore com status "pendente" para você aprovar
        await setDoc(doc(db, "users", uid), {
            email: email,
            status: "pendente",
            createdAt: new Date()
        });

        // Desloga o usuário imediatamente para impedir acesso direto
        await auth.signOut();

        alert("Cadastro realizado com sucesso! Sua conta está aguardando aprovação do administrador.");
        
        // Limpa os campos
        document.getElementById('email').value = "";
        document.getElementById('senha').value = "";

    } catch (error) {
        alert("Erro no cadastro: " + error.message);
    }
};

// ================= ALTERNAR ENTRE LOGIN E CADASTRO (Opcional) =================
// Se quiser que o botão de "Cadastrar-se" mude o comportamento do botão "Entrar" para registrar:
let isRegistering = false;

window.toggleRegisterForm = function(e) {
    e.preventDefault();
    isRegistering = !isRegistering;
    
    const actionButton = document.querySelector("#login-area button");
    const linkToggle = e.target;

    if (isRegistering) {
        actionButton.textContent = "Criar Conta";
        actionButton.setAttribute("onclick", "registerUser(event)");
        linkToggle.textContent = "Voltar para o Login";
    } else {
        actionButton.textContent = "Entrar";
        actionButton.setAttribute("onclick", "login()");
        linkToggle.textContent = "Cadastrar-se";
    }
};
