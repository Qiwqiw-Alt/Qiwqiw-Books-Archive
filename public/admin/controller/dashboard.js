import { db } from "../../assets/js/firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { deleteBook } from "./books.js"
import { deleteProject } from "./projects.js";

const adminBookContainer = document.getElementById('admin-book-list');
const booksRef = ref(db, 'books');

const adminProjectContainer = document.getElementById('admin-project-list');
const projectRef = ref(db, 'projects');

onValue(booksRef, (snapshot) => {
    adminBookContainer.innerHTML = "";

    if (snapshot.exists()) {
        const booksData = snapshot.val();
        let htmlContent = "";

        Object.keys(booksData).forEach((id) => {
            const book = booksData[id];

            htmlContent += `
            <div class="card shadow-sm border-0">
                    <div class="card-body d-flex align-items-center justify-content-between p-3">
                        
                        <div class="d-flex align-items-center gap-3">
                            <img src="${book.cover}" class="admin-cover-img shadow-sm" alt="${book.title}">
                            <div>
                                <h5 class="fw-bold mb-1 p-0">${book.title}</h5>
                                <p class="text-muted small mb-0">Oleh: ${book.author} (${book.published_year})</p>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <a href="form-book-402-qoqo.html?id=${id}" class="btn btn-warning btn-sm fw-bold text-dark">
                                 Edit
                            </a>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${id}" data-title="${book.title}">
                                 Hapus
                            </button>
                        </div>

                    </div>
                </div>
            `;
        });

        adminBookContainer.innerHTML = htmlContent;
        setupBookDeleteEventListeners();
    } else {
        adminBookContainer.innerHTML = `
            <div class="text-center text-muted my-5 py-5 bg-white rounded shadow-sm">
                <h5>Belum ada rangkuman buku. Silakan klik tombol "+ Tambah Buku Baru" di atas.</h5>
            </div>
        `
    }
})


onValue(projectRef, (snapshot) => {
    adminProjectContainer.innerHTML = "";

    if (snapshot.exists()) {
        const projectsData = snapshot.val();
        let htmlContent = "";

        Object.keys(projectsData).forEach((id) => {
            const project = projectsData[id];

            htmlContent += `
           <div class="card shadow-sm border-0">
                <div class="card-body d-flex align-items-center justify-content-between p-3">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${project.thumbnail || '#'}" class="admin-cover-img shadow-sm" alt="${project.title}">
                        <div>
                            <h5 class="fw-bold mb-1 p-0">${project.title}</h5>
                            <p class="text-muted small mb-0">Tech: ${project.tech_stack} (${project.created_year})</p>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="form-projects-401-qoqo.html?id=${id}" class="btn btn-warning btn-sm fw-bold text-dark">Edit</a>
                        <button class="btn btn-danger btn-sm delete-project-btn" data-id="${id}" data-title="${project.title}">Hapus</button>
                    </div>
                </div>
            </div>
            `;
        });

        adminProjectContainer.innerHTML = htmlContent;
        setupProjectDeleteEventListeners();
    } else {
        adminBookContainer.innerHTML = `
            <div class="text-center text-muted my-5 py-5 bg-white rounded shadow-sm">
                <h5>Belum ada proyek yang ditampilkan. Silakan klik tombol "+ Tambah Project Baru" di atas.</h5>
            </div>
        `
    }
})

function setupBookDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-book-btn');

    deleteButtons.forEach(buttons => {
        buttons.addEventListener('click', function() {
            const bookId = this.getAttribute('data-id');
            const bookTitle = this.getAttribute('data-title');

            deleteBook(bookId, bookTitle);
        });
    });
}

function setupProjectDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-project-btn');

    deleteButtons.forEach(buttons => {
        buttons.addEventListener('click', function() {
            const projectId = this.getAttribute('data-id');
            const projectTitle = this.getAttribute('data-title');

            deleteProject(projectId, projectTitle);
        });
    });
}