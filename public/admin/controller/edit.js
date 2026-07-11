import { db } from "../../main/js/firebase-config.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const urlPrams = new URLSearchParams(window.location.search);
const bookId = urlPrams.get('id');

const form = document.getElementById('edit-book-form');
const coverInput = document.getElementById('cover');
const coverPreview = document.getElementById('cover-preview');
const messageArea = document.getElementById('message-area');

let currentBase64Cover = "";

if (!bookId) {
    aleert("Id Buku tidak ditemukan!");
    window.location.href = "../view/admin.html";
} else {
    loadBookData();
}

function loadBookData() {
    const bookRef = ref(db, `books/${bookId}`);
    get(bookRef).then((snapshot) => {
        if (snapshot.exists()) {
            const book = snapshot.val();
            document.getElementById('title').value = book.title || "";
            document.getElementById('author').value = book.author || "";
            document.getElementById('published_year').value = book.published_year || "";
            document.getElementById('desc').value = book.desc || "";
           
            if (book.cover) {
                currentBase64Cover = book.cover;
                coverPreview.src = book.cover;
                coverPreview.style.display = 'block';
            }
        } else {
            alert("Data buku tidak ditemukan!");
            window.location.href = "../view/admin.html";
        }
    }).catch((error) => {
        console.error("Error fetching book data: ", error);
    })
}

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

    const updatedTitle = document.getElementById('title').value;
    const updatedAuthor = document.getElementById('author').value;
    const updatedPublishedYear = document.getElementById('published_year').value;
    const updatedDesc = document.getElementById('desc').value;
    const updatedCoverFile = coverInput.files[0];

    messageArea.className = "mb-3 alert alert-info";
    messageArea.innerText = "Memperbarui data buku...";
    messageArea.classList.remove('d-none');

    const sendUpdate = (coverDataString) => {
        const bookRef = ref(db, `books/${bookId}`);
        const updateData = {
            title: updatedTitle,
            author: updatedAuthor,
            published_year: updatedPublishedYear,
            desc: updatedDesc,
            cover: coverDataString,
            updated_at: new Date().toISOString()
        };

        update(bookRef, updateData).then(() => {
            messageArea.className = "mb-3 alert alert-success";
            messageArea.innerText = "Data buku berhasil diperbarui!";

            setTimeout(() => {
                window.location.href = "../view/admin.html";
            }, 1500);
        }).catch((error) => {
            messageArea.className = "mb-3 alert alert-danger";
            messageArea.innerText = "Gagal memperbarui data buku!";
            console.error("Error updating book data: ", error);
        })
    }

    if (updatedCoverFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            sendUpdate(e.target.result);
        };
        reader.readAsDataURL(updatedCoverFile);
    } else {
        sendUpdate(currentBase64Cover);
    }
});