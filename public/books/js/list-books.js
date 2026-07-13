import { db } from "../../assets/js/firebase-config.js";
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

            const shortDesc = book.desc.length > 90 ? book.desc.substring(0, 90) + "..." : book.desc;
        
            const htmlContent = `
                    <div class="col">
                        <div class="card h-100 flat-card">
                            <img src="${book.cover}" class="card-img-top flat-cover-img" alt="${book.title}">
                            <div class="card-body d-flex flex-column justify-content-between p-3">
                                <div>
                                    <h5 class="card-title fw-bold text-truncate mb-1" title="${book.title}">${book.title}</h5>
                                    <p class="card-text text-muted small mb-3">Oleh: ${book.author}</p>
                                    <p class="card-text small text-secondary">${shortDesc}</p>
                                </div>
                                <div class="mt-3">
                                    <a href="detail-book.html?book=${id}" class="btn-flat w-100 text-center">
                                        Baca Selengkapnya &raquo;
                                    </a>[cite: 5]
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            bookContainer.insertAdjacentHTML('beforeend', htmlContent);
    });
    } else {
        bookContainer.innerHTML = `
            <div class="col-12 text-center text-muted my-5">
                <p>Belum ada rangkuman buku yang diarsipkan.</p>
            </div>`;
    }
});

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            this.innerText = "Light Mode";
        } else {
            this.innerText = "Dark Mode";
        }
    });
}