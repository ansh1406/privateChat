import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
var dbref = ref(database);

var submit = document.getElementById("form1");
var logout = document.getElementById("logout");
var login = document.getElementById("login");
var uid = document.getElementById("uid");
var chatArea = document.getElementById("chatArea");
var sessionCode='';
var startSession= document.getElementById("startSession");
var sessionDisplay = document.getElementById("sessionDisplay");
var lastChatIndex=0;
var currentChatCount = 0;
startSession.addEventListener('click',async function(event){
   sessionCode = document.getElementById("sessionCode").value.toString();
   if(sessionCode!='')
   {
   chatArea.innerHTML='';
   lastChatIndex=0;
   currentChatCount=0;
  let data= await set(ref(database,sessionCode+'/misc'),{currentChatCount:0});
   }
   sessionDisplay.innerHTML='#'+sessionCode;
});

refreshUid();
submit.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (!localStorage.getItem("username")) {
    alert("No running account found! Please login");
    location.href = "login.html";
  } else {
    if(sessionCode!=''){
    let username = localStorage.getItem("username");
    var field = event.target.getElementsByTagName("input");
    var message = field[0].value.toString();
    var data = {
      message: message,
      username: username,
    };
    let res = await fetchData("/chat", data);
    addChat();
    field[0].value = "";
  }
  else alert("No Running Session Found");
  }
});
async function fetchData(path, data) {
  get(child(dbref, sessionCode+"/misc")).then(async (snap) => {
    currentChatCount =  parseInt(snap.val().currentChatCount);
    currentChatCount++;
    set(ref(database, sessionCode+'/chats/'+currentChatCount), data);
    set(ref(database, sessionCode+"/misc"), { currentChatCount: currentChatCount });
  });
  return 0;
}

logout.addEventListener("click", function (event) {
  if (localStorage.getItem("username")) {
    let username = localStorage.getItem("username");
    localStorage.setItem("username", "");
    fetchData("/logout_alert", { username: username });
    refreshUid();
  }
});
login.addEventListener("click", (event) => {
  location.href = "login.html";
});
function refreshUid() {
  uid.innerHTML = localStorage.getItem("username");
  if (uid.innerHTML == "") {
    uid.innerHTML = "No user found";
    logout.style.display = "none";
    login.style.display = "block";
  } else {
    logout.style.display = "block";
    login.style.display = "none";
  }
}
async function addChat() {
  if(localStorage.getItem("username")!=""&&localStorage.getItem("username")!=null)
  {
    if(sessionCode!=''){
  try{
    let data= await get(child(dbref, sessionCode+"/misc"));
    currentChatCount = await data.val().currentChatCount;
    if(lastChatIndex<=currentChatCount)
    {
       let res = await get(child(dbref,sessionCode+'/chats/'+lastChatIndex));
       let chat=await res.val();
      lastChatIndex++;
  if(chat)
    {
  console.log(chat);
       let div = document.createElement('div');
        if (chat.username == localStorage.getItem('username')) div.classList.add('chatSent');
        else div.classList.add('chatRecieved');
        let sender = document.createElement('p');
        let message = document.createElement('p');
        sender.style.marginLeft = '2%';
        message.style.marginLeft = '2%';
        sender.textContent = chat.username;
        message.textContent = chat.message;
        div.appendChild(sender);
        div.appendChild(message);
        chatArea.appendChild(div);
    } 
  }
  }
   catch(error) {console.log(error);}
  }
}
  else location.href='login.html';
}
setInterval(addChat, 1000);

