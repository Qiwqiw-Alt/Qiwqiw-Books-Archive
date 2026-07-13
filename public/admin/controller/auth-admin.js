import { db } from "../../assets/js/firebase-config.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

const loginForm = document.getElementById('login-form');
const errorAlert = document.getElementById('error-message');
const btnSubmit = document.getElementById('btn-submit');


if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        btnSubmit.innerText = "MEMVERIFIKASI...";
        btnSubmit.disabled = true;
        errorAlert.classList.add('d-none');

        const emailValue = document.getElementById('email').value.trim();
        const passwordValue = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, emailValue, passwordValue).then((userCredential) => {
            const user = userCredential.user;
            console.log("Login sukses sebagai: ", user.email);

            window.location.href = "dashboard-404-qoqo.html"
        }).catch((error) => {
            console.error("Proses login bermasalah:", error.message);
                
                errorAlert.innerText = "Gagal Masuk: Email atau password tidak sesuai.";
                errorAlert.classList.remove('d-none');
                
                btnSubmit.innerText = "MASUK KE DASHBOARD";
                btnSubmit.disabled = false;
        });
    });
}