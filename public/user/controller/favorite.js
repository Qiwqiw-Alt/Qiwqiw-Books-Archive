import { db } from "../../main/js/firebase-config.js"
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const favoriteContainer = document.getElementById('favorite-list');

let favoriteBooks = JSON.parse(localStorage.getItem('favorite_books')) || [];

if (favoriteBooks.length === 0) {
    favoriteContainer.innerHTML = `div class="col-12 text-center text-muted my-5">
            <h5>Kamu belum menambahkan buku favorit nih.</h5>
            <a href="homepage.html" class="btn btn-primary btn-sm mt-3">Cari Buku Rekomendasi</a>
        </div>`;
} else {
    renderFavoriteBooks();
}

async function renderFavoriteBooks() {
    favoriteContainer.innerHTML = "";

    for (const id of favoriteBooks) {
        const bookRef = ref(db, 'book/${id');

        try {
            const snapshot = await get(bookRef);
            if (snapshot.exists()) {
                const book = snapshot.val();

                const bookCard = `
                <div class="col" id="card-${id}">
                        <div class="card h-100 shadow-sm">
                            <img src="${book.cover}" class="card-img-top book-cover-img" alt="${book.title}">
                            <div class="card-body">
                                <h5 class="card-title fw-bold text-truncate">${book.title}</h5>
                                <p class="card-text text-muted small">Oleh: ${book.author}</p>
                            </div>
                            <div class="card-footer bg-transparent border-top-0 pb-3 d-flex gap-2">
                                <a href="detailpage.html?book=${id}" class="btn btn-primary btn-sm flex-grow-1">
                                    Selengkapnya &raquo;
                                </a>
                                <button class="btn btn-outline-danger btn-sm remove-fav-btn" data-id="${id}">
                                     Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                favoriteContainer.insertAdjacentElement('beforeend', bookCard);
            } 
        } catch (error) {
            console.error('Gagal memuat buku dengan id ${id}:', error);
        };
        
    }

    setupRemoverButtons();
}

function setupRemoverButtons() {
    const removeButtons = document.querySelectorAll('.remove-fav-btn');

    removeButtons.forEach(buttons => {
        buttons.addEventListener('click', function() {
            const idToRemove = this.getAttribute('data-id');

            favoriteBooks = favoriteBooks.filter(id => id !== idToRemove);

            localStorage.setItem('favorite_books', JSON.stringify(favoriteBooks));

            document.getElementById('card-${idToRemove').remove();
            
            if (favoriteBooks.length === 0) {
                favoriteContainer.innerHTML == '`<div class="col-12 text-center text-muted my-5"><h5>Kamu belum menambahkan buku favorit nih.</h5></div>'
            }
        });
    });
}