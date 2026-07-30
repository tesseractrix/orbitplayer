import { auth, db } from "./firebase-config-test.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

/*
 * Criar playlist
 */
window.createPlaylist = async function () {

    const user = auth.currentUser;

    if (!user) {
        alert("Usuário não autenticado");
        return;
    }

    const input =
        document.getElementById("playlistName");

    const playlistName =
        input.value.trim();

    if (!playlistName) {
        alert("Digite um nome para a playlist");
        return;
    }

    try {

        await addDoc(
            collection(
                db,
                "users",
                user.uid,
                "playlists"
            ),
            {
                name: playlistName,
                songs: [],
                createdAt: Date.now()
            }
        );

        input.value = "";

        loadPlaylists();

    } catch (error) {

        console.error(
            "Erro ao criar playlist:",
            error
        );

        alert(
            "Erro ao criar playlist."
        );

    }

};

/*
 * Carregar playlists
 */
window.loadPlaylists = async function () {

    const user = auth.currentUser;

    if (!user) return;

    try {

        const snapshot = await getDocs(
            collection(
                db,
                "users",
                user.uid,
                "playlists"
            )
        );

        const playlistList =
            document.getElementById(
                "playlistList"
            );

        playlistList.innerHTML = "";

        snapshot.forEach((playlistDoc) => {

            const playlist =
                playlistDoc.data();

            const li =
                document.createElement("li");

            li.innerHTML = `
                <span>${playlist.name}</span>

                <button
                    onclick="deletePlaylist('${playlistDoc.id}')"
                    style="
                        margin-left:10px;
                        padding:4px 8px;
                    "
                >
                    🗑
                </button>
            `;

            playlistList.appendChild(li);

        });

    } catch (error) {

        console.error(
            "Erro ao carregar playlists:",
            error
        );

    }

};

/*
 * Excluir playlist
 */
window.deletePlaylist = async function (
    playlistId
) {

    const user = auth.currentUser;

    if (!user) return;

    const confirmar = confirm(
        "Deseja excluir esta playlist?"
    );

    if (!confirmar) return;

    try {

        await deleteDoc(
            doc(
                db,
                "users",
                user.uid,
                "playlists",
                playlistId
            )
        );

        loadPlaylists();

    } catch (error) {

        console.error(
            "Erro ao excluir playlist:",
            error
        );

        alert(
            "Não foi possível excluir."
        );

    }

};

/*
 * Quando usuário logar
 */
onAuthStateChanged(auth, (user) => {

    if (user) {

        loadPlaylists();

    }

});