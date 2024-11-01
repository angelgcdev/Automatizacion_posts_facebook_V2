const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");
const userAdmin = localStorage.getItem("userAdmin");

if (!token) {
  //Si no hay token, redirigir a la pagina de login
  window.location.href = "../login.html";
}

if (userAdmin === "false") {
  window.location.href = "../error.html";
}

//Datos de ejemplo
const posts = [
  {
    id: 1,
    image: "https://via.placeholder.com/100",
    shares: 150,
    reacctions: 500,
    message: "!Gran Oferta¡",
    url: "https://facebook.com/post1",
    groupName: "Ventas",
    date: "2023-05-01",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/100",
    shares: 1554,
    reacctions: 400,
    message: "!Nuevo producto¡",
    url: "https://facebook.com/post2",
    groupName: "Novedades",
    date: "2023-05-02",
  },
];

const totalShares = 255;
const sharesByDay = [
  { date: "2023-05-01", shares: 150 },
  { date: "2023-05-02", shares: 75 },
];

const facebookAccounts = ["cuenta1@facebook.com", "cuenta2@facebook.com"];
const appUsers = ["usuario1@app.com", "usuario2@app.com"];

//Elementos del DOM
const content = document.getElementById("content");
const resumenBtn = document.getElementById("resumenBtn");
const publicacionesBtn = document.getElementById("publicacionesBtn");
const registroBtn = document.getElementById("registroBtn");

//Funciones para renderizar contenido
const renderResumen = () => {
  content.innerHTML = `
  <div class="informe__grid">
  <div class="informe__card">
    <h2 class="informe__card-title">Total De Compartidas</h2>
    <p class="informe__big-number">${totalShares}</p>
  </div>
  <div class="informe__card">
    <h2 class="informe__card-title">Compartidas por dia</h2>
    <ul>
      ${sharesByDay
        .map((day) => `<li>${day.date}: ${day.shares}</li>`)
        .join("")}
    </ul>
  </div>
  <div class="informe__card"> 
    <h2 class="informe__card-title">Cuentas y Usuarios</h2>
    <h3>Cuentas de Facebook:</h3>
    <ul>
      ${facebookAccounts.map((account) => `<li>${account}</li>`).join("")}
    </ul>
    <h3>Usuarios de la aplicación:</h3>
    <ul>
      ${appUsers.map((user) => `<li>${user}</li>`).join("")}
    </ul>
  </div>
</di>
  `;
};

//Inicializar la página con el resumen
renderResumen();
