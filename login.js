let loginForm =document.getElementById("loginForm");
loginForm.addEventListener('submit',async function(event){
  event.preventDefault();
  username = event.target.getElementsByTagName('input')[0].innerHTML;
  localStorage.setItem('username',username);
  location.href='index.html';
});
