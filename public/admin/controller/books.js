import { db } from "../../assets/js/firebase-config";
import { ref, push, set, remove, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


const form = document.getElementById('book-form');
const coverInput = document.getElementById('cover');
const coverPreview = document.getElementById('cover-preview');
const messageArea = document.getElementById('message-area');
const submitBtn = document.getElementById('submit-btn');

const urlPrams = new URLSearchParams(window.location.search);
const bookId = urlPrams.get('id');
const isEditMode = bookId !== null;

let currentBase64Cover = "";

if (isEditMode) {
    loadBookData();
    
    document.getElementById('page-title').innerText = "Edit Informasi Buku";
    document.getElementById('form-header').innerText = "Edit";
    document.getElementById('submit-btn').innerText = "Simpan Perubahan";
}

// Read Data
function loadBookData() {
    messageArea.className = "mb-3 alert alert-info";
    messageArea.innerText = "Memuat data buku...";
    messageArea.classList.remove('d-none');

    const bookRef = ref(db, `books/${bookId}`);
    get(bookRef).then((snapshot) => {
        messageArea.classList.add('d-none');

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

            if (submitBtn) submitBtn.innerText = "Perbarui Data Buku";

        } else {
            alert("Data buku tidak ditemukan!");
            window.location.href = "../view/admin.html";
        }
    }).catch((error) => {
        console.error("Error fetching book data: ", error);
        messageArea.className = "mb-3 alert alert-danger";
        messageArea.innerText = "Gagal memuat data buku."
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

// Create and Edit
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const publishedYear = document.getElementById('published_year').value;
    const desc = document.getElementById('desc').value;
    const coverFile = coverInput.files[0];

    messageArea.className = "mb-3 alert alert-info";
    messageArea.innerText = isEditMode ? "Memperbarui data buku..." : "Menyimpan data buku...";
    messageArea.classList.remove('d-none');

    const handleSaveData = (coverDataString) => {
        if (isEditMode) {
            const bookRef = ref(db, `books/${bookId}`);
            const updateData = {
                title: title,
                author: author,
                published_year: publishedYear,
                desc: desc,
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
            });
        } else {
            const bookData = {
                title: title,
                author: author,
                published_year: publishedYear,
                desc: desc,
                cover: coverDataString,
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
            });
        }
    };

    if (coverFile) {
        const reader = new FileReader();
        reader.onload = function(e) { handleSaveData(e.target.result)}
        reader.readAsDataURL(coverFile);
    } else {
        if (isEditMode) {
            handleSaveData(currentBase64Cover);
        } else {
            messageArea.className = "mb-3 alert alert-danger";
            messageArea.innerText = "Silakan pilih file cover buku!";
        }
    }
});

function handleActionError(error) {
    console.error("Database Transaction Error: ", error);
    messageArea.className = "mb-3 alert alert-danger";
    messageArea.innerText = "Terjadi kesalahan: " + error.message;
}

// Delete
export function deleteBook(bookId, bookTitle) {
    const bookRef = ref(db, `books/${bookId}`);
    
    remove(bookRef).then(() => {
        alert("Buku '" + bookTitle + "' berhasil dihapus!");
        window.location.reload();

    }).catch((error) => {
        console.error("Error deleting book: ", error);
        alert("Terjadi kesalahan saat menghapus buku: " + error.message);
    })
}