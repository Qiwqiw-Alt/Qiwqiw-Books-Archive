import { db } from "../../main/js/firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const bookContainer = document.getElementById('book-list');
const themeToggle = document.getElementById('theme-toggle');

const booksRef = ref(db, 'books');

onValue(booksRef, (snapshot) => {
    bookContainer.innerHTML = "";

    if (snapshot.exists()) {
        const booksData = snapshot.val();

        Object.keys(booksData).forEach((id) => {
            const book = booksData[id];

            const bookCard = `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="${book.cover}" class="card-img-top book-cover-img" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-truncate">${book.title}</h5>
                            <p class="card-text text-muted small">Oleh: ${book.author}</p>
                            <p class="card-text text-truncate">${book.desc}</p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0 pb-3">
                            <a href="detailpage.html?book=${id}" class="btn btn-primary btn-sm w-100">
                                Selengkapnya &raquo;
                            </a>
                        </div>
                    </div>
                </div>
            `;

            bookContainer.insertAdjacentHTML('beforeend', bookCard);
        });
    } else {
        bookContainer.innerHTML = `<div class="col-12 text-center text-muted my-5"><h5>Belum ada archive buku yang tersedia.</h5></div>`;
    }
});

themeToggle.addEventListener('click', function () { 
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerText = "Light Mode";
    } else {
        themeToggle.innerText = "Dark Mode";
    }
 });