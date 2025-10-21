// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  push,
  remove,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";

// ===============================
//  Firebase Configuration
// ===============================
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

// ===============================
//  Initialize Firebase
// ===============================
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const dbref = ref(database);

// ===============================
//  DOM Elements
// ===============================
const submit = document.getElementById("form1");
const logout = document.getElementById("logout");
const login = document.getElementById("login");
const uid = document.getElementById("uid");
const chatArea = document.getElementById("chatArea");
const startSession = document.getElementById("startSession");
const endSession = document.getElementById("endSession");
const sessionDisplay = document.getElementById("sessionDisplay");

let sessionCode = '';
let chatListener = null; // for detaching listener when session ends

// ===============================
//  Helper: Refresh UI State
// ===============================
function refreshUid() {
  uid.innerHTML = localStorage.getItem("username") || "No user found";
  if (!localStorage.getItem("username")) {
    logout.style.display = "none";
    login.style.display = "block";
  } else {
    logout.style.display = "block";
    login.style.display = "none";
  }
}
refreshUid();

// ===============================
//  Start Chat Session
// ===============================
startSession.addEventListener("click", async function () {
  const input = document.getElementById("sessionCode");
  sessionCode = input.value.trim();
  
  if (sessionCode === "") {
    alert("Enter a valid session code!");
    return;
  }

  chatArea.innerHTML = '';
  sessionDisplay.innerHTML = `#${sessionCode}`;

  // If session doesn’t exist, initialize metadata
  const miscSnap = await get(child(dbref, sessionCode + '/misc'));
  if (!miscSnap.exists()) {
    await set(ref(database, sessionCode + '/misc'), { createdAt: Date.now() });
  }

  listenForChats();
});

// ===============================
//  End Chat Session
// ===============================
endSession.addEventListener("click", async function () {
  if (chatListener) chatListener(); // detach real-time listener
  sessionCode = '';
  chatArea.innerHTML = '';
  sessionDisplay.innerHTML = '';
  alert("Session ended.");
});

// ===============================
//  Send a Message
// ===============================
submit.addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = localStorage.getItem("username");
  if (!username) {
    alert("No running account found! Please login.");
    location.href = "login.html";
    return;
  }

  if (!sessionCode) {
    alert("No active session found!");
    return;
  }

  const field = event.target.getElementsByTagName("input")[0];
  const message = field.value.trim();
  if (message === "") return;

  const data = {
    username,
    message,
    timestamp: Date.now(),
  };

  const chatRef = ref(database, `${sessionCode}/chats`);
  await push(chatRef, data);
  field.value = "";
});

// ===============================
//  Real-Time Chat Listener
// ===============================
function listenForChats() {
  if (!sessionCode) return;

  const chatRef = ref(database, `${sessionCode}/chats`);
  chatArea.innerHTML = "";

  // Remove previous listener if exists
  if (chatListener) chatListener();

  chatListener = onChildAdded(chatRef, (snapshot) => {
    const chat = snapshot.val();
    if (!chat) return;

    const div = document.createElement("div");
    const isMe = chat.username === localStorage.getItem("username");
    div.classList.add(isMe ? "chatSent" : "chatRecieved");

    const sender = document.createElement("p");
    sender.textContent = chat.username;
    sender.style.marginLeft = "2%";
    sender.style.fontWeight = "bold";

    const message = document.createElement("p");
    message.textContent = chat.message;
    message.style.marginLeft = "2%";

    div.appendChild(sender);
    div.appendChild(message);
    chatArea.appendChild(div);

    // auto-scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
  });
}

// ===============================
//  Logout / Login Buttons
// ===============================
logout.addEventListener("click", function () {
  if (localStorage.getItem("username")) {
    localStorage.removeItem("username");
    refreshUid();
    alert("Logged out successfully!");
  }
});

login.addEventListener("click", () => {
  location.href = "login.html";
});
