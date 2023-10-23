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

let loginForm =document.getElementById("loginForm");
loginForm.addEventListener('submit',async function(event){
  event.preventDefault();
  let username = event.target.getElementsByTagName('input')[0].value.toString();
  let password = event.target.getElementsByTagName('input')[1].value.toString();
  let credential = await get(child(dbref,'auth/'+username));
  let realPassword = await credential.val().password;
  if(realPassword!=null&& realPassword!=""){
  if(password==realPassword){
    localStorage.setItem('username',username);
    location.href='index.html';
  }
  else alert("Password Incorrect");
}
  else alert("UserID Incorrect");
 
});
