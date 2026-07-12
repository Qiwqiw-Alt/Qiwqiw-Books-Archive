import { db } from "../../assets/js/firebase-config";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search)
const bookId = urlParams.get('book');

if (bookId) {
    
} else {
    console.log("Buku tidak ada!");
    alert("Parameter buku tidak ditemukan");
    window.location.href = "index.html";
}

function renderDetailPage(id) {
    const bookRef = ref(db, `books/${id}`);

    get(bookRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const book = snapshot.val(); 

                document.title = `Detail Buku ${book.title}`; 
                
                document.getElementById('book-title').innerText = book.title;
                document.getElementById('book-author').innerText = `Oleh: ${book.author}`;
                document.getElementById('book-year').innerText = `Tahun: ${book.published_year}`;
                
                document.getElementById('desc').innerText = book.desc;

                const imgElement = document.querySelector('#book-cover');
                if (imgElement) {
                    imgElement.src = book.cover;
                    imgElement.alt = book.title.toLowerCase().replace(/\s+/g, '-');
                }
            } else {
                console.log("Buku tidak ada di database!");
                alert("Data buku tidak ditemukan di database Archive.");
                window.location.href = "index.html";
            }
        })
        .catch((error) => {
            console.error("Gagal memuat data dari Firebase:", error);
        });
}

const themeToggle = document.getElementById('theme-toggle');
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