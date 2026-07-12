import { db } from "../../main-js/firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

if (projectId) {
    loadProjectDetail(projectId);
} else {
    alert("ID Projek tidak ditemukan!");
    window.location.href = "list-projects.html";
}

function loadProjectDetail(id) {
    const projectRef = ref(db, `projects/${id}`);

    get(projectRef).then((snapshot) => {
        if (snapshot.exists()) {
            const project = snapshot.val();

            // Ubah Title Browser & Elemen Teks Utama
            document.title = `Projek: ${project.title}`;
            document.getElementById('project-title').innerText = project.title;
            document.getElementById('project-tag').innerText = project.category || "Website";

            // Siapkan element content generator
            const container = document.getElementById('project-details-content');
            container.innerHTML = ""; // Bersihkan dummy text

            const sections = [
                { label: "CHALLENGES", data: project.challenges },
                { label: "KEY DECISIONS", data: project.decisions },
                { label: "OUTCOME", data: project.outcome }
            ];

            sections.forEach(sec => {
                if (sec.data) {
                    const contentHtml = Array.isArray(sec.data) 
                        ? `<ul class="ps-3">${sec.data.map(item => `<li class="mb-2">${item}</li>`).join('')}</ul>`
                        : `<p>${sec.data}</p>`;

                    const sectionHtml = `
                        <div class="mb-4">
                            <span class="section-title d-inline-block border-bottom border-2 border-dark pb-1 mb-2">${sec.label}</span>
                            <div class="small text-secondary">${contentHtml}</div>
                        </div>
                    `;
                    container.insertAdjacentHTML('beforeend', sectionHtml);
                }
            });

        } else {
            alert("Projek tidak ditemukan di database!");
            window.location.href = "list-projects.html";
        }
    }).catch((error) => {
        console.error("Gagal mengambil detail projek:", error);
    });
}