import { db } from "../../assets/js/firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const projectContainer = document.getElementById('project-list');
const themeToggle = document.getElementById('theme-toggle');

const projectsRef = ref(db, 'projects');

onValue(projectsRef, (snapshot) => {
    projectContainer.innerHTML = "";

    if (snapshot.exists()) {
        const projectsData = snapshot.val();

        Object.keys(projectsData).forEach((id) => {
            const project = projectsData[id];

            const shortDesc = project.desc.length > 90 ? project.desc.substring(0, 90) + "..." : project.desc;
        
            const htmlContent = `
                    <div class="col">
                        <div class="card h-100 flat-card">
                            <img src="${project.thumbnail}" class="card-img-top flat-cover-img" alt="${project.title}">
                            <div class="card-body d-flex flex-column justify-content-between p-3">
                                <div>
                                    <h5 class="card-title fw-bold text-truncate mb-1" title="${project.title}">${project.title}</h5>
                                    <p class="card-text text-muted small mb-3">Tahun: ${project.created_year}</p>
                                    <p class="card-text small text-secondary">${shortDesc}</p>
                                </div>
                                <div class="mt-3">
                                    <a href="detailpage.html?project=${id}" class="btn-flat w-100 text-center">
                                        Baca Selengkapnya &raquo;
                                    </a>[cite: 5]
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            projectContainer.insertAdjacentElement('beforeend', htmlContent);
    });
    } else {
        projectContainer.innerHTML = `
            <div class="col-12 text-center text-muted my-5">
                <p>Belum ada proyek yang ditampilkan.</p>
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