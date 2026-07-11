import { db } from "../../main/js/firebase-config"
import { ref, get, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('book');

if (!bookId) {
    alert("Buku tidak ditemukan");
    window.location.href = "home.html";
} else {
    renderDetaulPage();
}

const targetCardBody = document.getElementById('book-desc').parentElement;
const favBtn = document.createElement('button');
favBtn.className = "btn btn-outline-danger mt-4 w-100";
favBtn.innerHTML = "Tambahkan ke Favorit";
targetCardBody.appendChild(favBtn);

favBtn.addEventListener('click', function() {
    let favoriteBooks = JSON.parse(localStorage.getItem('favorite_books')) || [];

    if (!favoriteBooks.includes(bookId)) {
        favoriteBooks.push(bookId);
        localStorage.setItem('favorite_books', JSON.stringify(favoriteBooks));
        alert("Buku berhasil ditambahkan ke daftar favorit!");
    } else {
        alert("Buku sudah ada di daftar favorit!");
    }
});

function renderDetailPage() {
    const bookRef = ref(db, 'books/${bookId}');

    get(bookRef).then((snapshot) => {
        if (snapshot.exists()) {
            const book = snapshot.val();

            document.title = `Detail Buku - ${book.title}`;
            document.getElementById('book-title').innerText = book.title;
            document.getElementById('book-author').innerText = `Penulis: ${book.author}`;
            document.getElementById('book-year').innerText = `Tahun Terbit: ${book.published_year}`;
            document.getElementById('book-desc').innerText = book.desc;
            document.getElementById('book-cover').src = book.cover;
        } else {
            alert("Waduh, data buku tidak ditemukan!");
            window.location.href = "homepage.html";
        }
    }).catch((error) => {
        console.error("Gagal memuat detail buku: ", error);
    });
}