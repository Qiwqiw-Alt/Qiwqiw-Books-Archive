import { db } from "../../main/js/firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


const form = document.getElementById('add-book-form');
const coverInput = document.getElementById('cover');
const coverPreview = document.getElementById('cover-preview');
const messageArea = document.getElementById('message-area');

coverInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            coverPreview.src = e.target.result;
            coverPreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const publishedYear = document.getElementById('published_year').value;
    const desc = document.getElementById('desc').value;
    const coverFile = coverInput.files[0];

    messageArea.className = "mb-3 alert alert-info";
    messageArea.innerText = "Menyimpan data buku...";
    messageArea.classList.remove('d-none');

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Cover = e.target.result;

        const bookData = {
            title: title,
            author: author,
            published_year: publishedYear,
            desc: desc,
            cover: base64Cover,
            created_at: new Date().toISOString()
        };

        const booksRef = ref(db, 'books');
        const newBookRef = push(booksRef);

        set(newBookRef, bookData).then(() => {
            messageArea.className = "mb-3 alert alert-success";
            messageArea.innerText = "Data buku berhasil disimpan!";
            form.reset();
            coverPreview.style.display = 'none';
        }).catch((error) => {

            console.error("Error adding book: ", error);
            messageArea.className = "mb-3 alert alert-danger";
            messageArea.innerText = "Terjadi kesalahan saat menyimpan data buku: " + error.message;
        })
    };

    if (coverFile) {
        reader.readAsDataURL(coverFile);
    } else {
        messageArea.className = "mb-3 alert alert-danger";
        messageArea.innerText = "Silakan pilih file cover buku!";
    }
});