import { db } from "../../main/js/firebase-config.js";
import { ref, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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