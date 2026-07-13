import { db } from "../../assets/js/firebase-config.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.email !== "") {// ganti email yang sudah didaftarkan di database
            console.warn("Akses ditolak: Anda bukan admin!");

            signOut(auth).then(() => {
                window.location.href = "../../index.html";
            });
        } else {
            console.log("Akses diizinkan. Selamat datang, Admin.");
        }
    } else {
        console.warn("Akses ilegal! Anda bukan Admin.");
        alert("Akses ditolak! Anda bukan admin.");
        
        window.location.href = "../../index.html";
    }
})