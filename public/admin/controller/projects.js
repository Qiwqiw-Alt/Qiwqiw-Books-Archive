import { db } from "../../assets/js/firebase-config";
import { ref, push, set, remove, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";


const form = document.getElementById('project-form');
const thumbnailInput = document.getElementById('thumbnail');
const thumbnailPreview = document.getElementById('thumbnail-preview');
const messageArea = document.getElementById('message-area');
const submitBtn = document.getElementById('submit-btn');

const urlPrams = new URLSearchParams(window.location.search);
const projectId = urlPrams.get('id');
const isEditMode = projectId !== null;

let currentBase64Thumbnail = "";

if (isEditMode) {
    loadProjectData();
    
    document.getElementById('page-title').innerText = "Edit Informasi Proyek";
    document.getElementById('form-header').innerText = "Edit";
    document.getElementById('submit-btn').innerText = "Simpan Perubahan";
}

// Read Data
function loadProjectData() {
    messageArea.className = "mb-3 alert alert-info";
    messageArea.innerText = "Memuat data Proyek...";
    messageArea.classList.remove('d-none');

    const projectRef = ref(db, `projects/${projectId}`);
    get(projectRef).then((snapshot) => {
        messageArea.classList.add('d-none');

        if (snapshot.exists()) {
            const project = snapshot.val();
            document.getElementById('title').value = project.title || "";
            document.getElementById('desc').value = project.desc || "";
            document.getElementById('tech-stack').value = project.tech || "";
            document.getElementById('project-category').value = project.category || "";
            document.getElementById('project-url').value = project.project_url || "";
            document.getElementById('production-url').value = project.production_url || "";
            document.getElementById('status-project').value = project.status || "";
            document.getElementById('created-year').value = project.created_year || "";
           
            if (project.thumbnail) {
                currentBase64Thumbnail = project.thumbnail;
                thumbnailPreview.src = project.thumbnail;
                thumbnailPreview.style.display = 'block';
            }

            if (submitBtn) submitBtn.innerText = "Perbarui Data Proyek";

        } else {
            alert("Data Proyek tidak ditemukan!");
            window.location.href = "../view/admin.html";
        }
    }).catch((error) => {
        console.error("Error fetching project data: ", error);
        messageArea.className = "mb-3 alert alert-danger";
        messageArea.innerText = "Gagal memuat data projek."
    })
}

thumbnailInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            thumbnailPreview.src = e.target.result;
            thumbnailPreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Create and Edit
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const tech_stack = document.getElementById('tech-stack').value;
    const project_category = document.getElementById('project-category').value;
    const project_url = document.getElementById('project-url').value;
    const production_url = document.getElementById('production-url').value;
    const status_project = document.getElementById('status-project').value;
    const created_year = document.getElementById('created-year').value;
    const thumbnailFile = thumbnailInput.files[0];

    messageArea.className = "mb-3 alert alert-info";
    messageArea.innerText = isEditMode ? "Memperbarui data proyek..." : "Menyimpan data proyek...";
    messageArea.classList.remove('d-none');

    const handleSaveData = (thumbnailDataString) => {
        if (isEditMode) {
            const projectRef = ref(db, `projects/${projectId}`);
            const updateData = {
                title: title,
                desc: desc,
                tech_stack: tech_stack,
                project_category: project_category,
                project_url: project_url,
                production_url: production_url,
                status_project: status_project,
                created_year: created_year,
                thumbnail: thumbnailDataString,
                updated_at: new Date().toISOString()
            };

            update(projectRef, updateData).then(() => {
                messageArea.className = "mb-3 alert alert-success";
                messageArea.innerText = "Data proyek berhasil diperbarui!";

                setTimeout(() => {
                    window.location.href = "../view/admin.html";
                }, 1500);
            }).catch((error) => {
                messageArea.className = "mb-3 alert alert-danger";
                messageArea.innerText = "Gagal memperbarui data proyek!";
                console.error("Error updating project data: ", error);
            });
        } else {
            const projectData = {
                title: title,
                desc: desc,
                tech_stack: tech_stack,
                project_category: project_category,
                project_url: project_url,
                production_url: production_url,
                status_project: status_project,
                created_year: created_year,
                thumbnail: thumbnailDataString,
                created_at: new Date().toISOString()
            };

            const projectsRef = ref(db, 'books');
            const newProjectRef = push(projectsRef);

            set(newProjectRef, projectData).then(() => {
                messageArea.className = "mb-3 alert alert-success";
                messageArea.innerText = "Data proyek berhasil disimpan!";
                form.reset();
                thumbnailPreview.style.display = 'none';
            }).catch((error) => {
                console.error("Error adding project: ", error);
                messageArea.className = "mb-3 alert alert-danger";
                messageArea.innerText = "Terjadi kesalahan saat menyimpan data proyek: " + error.message;
            });
        }
    };

    if (thumbnailFile) {
        const reader = new FileReader();
        reader.onload = function(e) { handleSaveData(e.target.result)}
        reader.readAsDataURL(thumbnailFile);
    } else {
        if (isEditMode) {
            handleSaveData(currentBase64Thumbnail);
        } else {
            messageArea.className = "mb-3 alert alert-danger";
            messageArea.innerText = "Silakan pilih file thumbnail proyek!";
        }
    }
});

function handleActionError(error) {
    console.error("Database Transaction Error: ", error);
    messageArea.className = "mb-3 alert alert-danger";
    messageArea.innerText = "Terjadi kesalahan: " + error.message;
}

// Delete
export function deleteProject(projectId, projectTitle) {
    const projectRef = ref(db, `projects/${projectId}`);
    
    remove(projectRef).then(() => {
        alert("Proyek '" + projectTitle + "' berhasil dihapus!");
        window.location.reload();

    }).catch((error) => {
        console.error("Error deleting project: ", error);
        alert("Terjadi kesalahan saat menghapus proyek: " + error.message);
    })
}