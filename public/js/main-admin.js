// Datos de ejemplo
const posts = [
  {
    id: 1,
    image: "https://via.placeholder.com/100",
    shares: 150,
    reactions: 500,
    message: "¡Gran oferta!",
    url: "https://facebook.com/post1",
    groupName: "Ventas",
    date: "2023-05-01",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/100",
    shares: 75,
    reactions: 300,
    message: "Nuevo producto",
    url: "https://facebook.com/post2",
    groupName: "Novedades",
    date: "2023-05-02",
  },
];

const totalShares = 225;
const sharesByDay = [
  { date: "2023-05-01", shares: 150 },
  { date: "2023-05-02", shares: 75 },
];

const facebookAccounts = ["cuenta1@facebook.com", "cuenta2@facebook.com"];
const appUsers = ["usuario1@app.com", "usuario2@app.com"];

// Elementos del DOM
const content = document.getElementById("content");
const resumenBtn = document.getElementById("resumenBtn");
const publicacionesBtn = document.getElementById("publicacionesBtn");
const registroBtn = document.getElementById("registroBtn");

// Funciones para renderizar contenido
function renderResumen() {
  content.innerHTML = `
        <div class="informe__grid">
            <div class="informe__card">
                <h2 class="informe__card-title">Total de Compartidas</h2>
                <p class="informe__big-number">${totalShares}</p>
            </div>

            <div class="informe__card">
                <h2 class="informe__card-title">Compartidas por Día</h2>
                <ul class="informe__list">
                    ${sharesByDay
                      .map(
                        (day) =>
                          `<li class="informe__item">${day.date}: <span>${day.shares}</span></li>`
                      )
                      .join("")}
                </ul>
            </div>
            
            <div class="informe__card">
                <h2 class="informe__card-title">Cuentas y Usuarios</h2>
                <h3 class="informe__card-subtitle">Cuentas de Facebook:</h3>
                <ul class="informe__list">
                    ${facebookAccounts
                      .map(
                        (account) => `<li class="informe__item">${account}</li>`
                      )
                      .join("")}
                </ul>
                <h3 class="informe__card-subtitle">Usuarios de la aplicación:</h3>
                <ul class="informe__list">
                    ${appUsers
                      .map((user) => `<li class="informe__item">${user}</li>`)
                      .join("")}
                </ul>
            </div>
        </div>
    `;
}

function renderPublicaciones() {
  content.innerHTML = `
        <div class="informe__grid">
            ${posts
              .map(
                (post) => `
                <div class="informe__card informe__post">
                    <img src="${post.image}" alt="Post image" class="informe__post-image">

                    <div class="informe__post-content">
                        <p class="informe__post-title">${post.message}</p>
                        <div class="informe__post-stats">
                            <div class="informe__post-details">
                              <svg 
                              xmlns="http://www.w3.org/2000/svg" width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor"
                              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            >
                              <circle cx="18" cy="5" r="3"></circle>
                              <circle cx="6" cy="12" r="3"></circle>
                              <circle cx="18" cy="19" r="3"></circle>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                              ${post.shares}
                            </div>

                            <div class="informe__post-details">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                              >
                                <path
                                  d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
                                </path>
                              </svg>
                              ${post.reactions}
                            </div>
                        </div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
}

function renderRegistro() {
  content.innerHTML = `
        <table class="informe__table">
            <thead>
                <tr>
                    <th>Correo de Facebook</th>
                    <th>Mensaje del Post</th>
                    <th>URL del Post</th>
                    <th>Nombre del Grupo</th>
                    <th>Fecha de Publicación</th>
                </tr>
            </thead>
            <tbody>
                ${posts
                  .map(
                    (post) => `
                    <tr>
                        <td>${facebookAccounts[0]}</td>
                        <td>${post.message}</td>
                        <td><a href="${post.url}" target="_blank">${post.url}</a></td>
                        <td>${post.groupName}</td>
                        <td>${post.date}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

// Event listeners
resumenBtn.addEventListener("click", () => {
  setActiveButton(resumenBtn);
  renderResumen();
});

publicacionesBtn.addEventListener("click", () => {
  setActiveButton(publicacionesBtn);
  renderPublicaciones();
});

registroBtn.addEventListener("click", () => {
  setActiveButton(registroBtn);
  renderRegistro();
});

// Función para establecer el botón activo
function setActiveButton(activeButton) {
  const buttons = [resumenBtn, publicacionesBtn, registroBtn];
  buttons.forEach((btn) => {
    btn.classList.remove("informe__button--active");
  });
  activeButton.classList.add("informe__button--active");
}

// Inicializar la página con el resumen
renderResumen();
