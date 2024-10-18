// public/js/logout.js
document.getElementById("logoutButton").addEventListener("click", () => {
  //Elimina el token del localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userEmail");

  //Redirige a la página de inicio de sesión
  window.location.href = "../login.html";
});
