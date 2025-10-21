import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy1a49YwgPzeykKEZpSZoTGLBWmu4LQpA",
  authDomain: "webapp-8afc9.firebaseapp.com",
  databaseURL: "https://webapp-8afc9-default-rtdb.firebaseio.com",
  projectId: "webapp-8afc9",
  storageBucket: "webapp-8afc9.appspot.com",
  messagingSenderId: "153657818080",
  appId: "1:153657818080:web:72c66046039ac28a20c985",
  measurementId: "G-8G8G7P4NYV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const dbRef = ref(database);

// Handle login form
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Retrieve username and password inputs
  const [usernameInput, passwordInput] = event.target.getElementsByTagName("input");
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  try {
    const credentialSnapshot = await get(child(dbRef, "auth/" + username));

    if (credentialSnapshot.exists()) {
      const realPassword = credentialSnapshot.val().password;

      if (password === realPassword) {
        localStorage.setItem("username", username);
        window.location.href = "index.html";
      } else {
        alert("Password incorrect");
      }
    } else {
      alert("User ID incorrect");
    }
  } catch (error) {
    console.error("Error accessing database:", error);
    alert("An error occurred while logging in. Please try again.");
  }
});
