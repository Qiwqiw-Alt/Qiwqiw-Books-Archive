import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, connectDatabaseEmulator } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-lVJuwywuPe3glWSTZXej-lKgysPzRe8",
  authDomain: "qiqi-archive-api.firebaseapp.com",
  databaseURL: "https://qiqi-archive-api-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "qiqi-archive-api",
  storageBucket: "qiqi-archive-api.firebasestorage.app",
  messagingSenderId: "533898860581",
  appId: "1:533898860581:web:57d0ef00206f77693007cc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    console.log("Connecting to Firebase emulators...");
    connectDatabaseEmulator(db, "localhost", 9000);
    connectAuthEmulator(auth, "http://localhost:9099");
}

export { db, auth };