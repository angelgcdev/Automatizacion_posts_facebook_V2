// public/js/main-admin.js

import { logoutUser } from "./utils/logoutUser.js";
import { requestData } from "./utils/requestData.js";
import { showLoading } from "./utils/showLoading.js";
import { hideLoading } from "./utils/hideLoading.js";

// Datos del usuario
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");
const userAdmin = localStorage.getItem("userAdmin");

//Validacion del usuario
document.addEventListener("DOMContentLoaded", () => {
  if (!token || userAdmin === "false") {
    logoutUser();
  }
});

// Datos de ejemplo
// const posts = [
//   {
//     id: 1,
//     image: "https://via.placeholder.com/100",
//     shares: 150,
//     reactions: 500,
//     message: "¡Gran oferta!",
//     url: "https://facebook.com/post1",
//     groupName: "Ventas",
//     date: "2023-05-01",
//   },
//   {
//     id: 2,
//     image: "https://via.placeholder.com/100",
//     shares: 75,
//     reactions: 300,
//     message: "Nuevo producto",
//     url: "https://facebook.com/post2",
//     groupName: "Novedades",
//     date: "2023-05-02",
//   },
// ];

// const facebookAccounts = ["cuenta1@facebook.com", "cuenta2@facebook.com"];
// const appUsers = ["usuario1@app.com", "usuario2@app.com"];

let posts = [];

// Elementos del DOM

const content = document.getElementById("content");
const resumenBtn = document.getElementById("resumenBtn");
const publicacionesBtn = document.getElementById("publicacionesBtn");
const registroBtn = document.getElementById("registroBtn");

// Funciones para renderizar contenido
const renderResumen = async () => {
  const totalCG = await requestData("/admin/totalCG");
  const sharesByDay = await requestData("/admin/sharesByDay");
  const facebookAccounts = await requestData("/admin/facebookAccounts");
  const appUsers = await requestData("/admin/appUsers");

  content.innerHTML = `
        <div class="informe__grid">
            <div class="informe__card">
                <h2 class="informe__card-title">Total de Compartidas</h2>
                <p class="informe__big-number">${
                  totalCG.total_compartidas_global
                }</p>
            </div>

            <div class="informe__card">
                <h2 class="informe__card-title">Compartidas por Día</h2>
                <ul class="informe__list">
                    ${sharesByDay
                      .map(
                        (day) => `
                        <li class="informe__item">
                        ${new Date(day.dia).toLocaleDateString(
                          "es-ES"
                        )}: <span>${day.total_publicaciones}</span>
                        </li>
                        `
                      )
                      .join("")}
                </ul>
            </div>
            
            <div class="informe__card">
                <h2 class="informe__card-title">Cuentas de Facebook</h2>
                <ul class="informe__list">
                    ${facebookAccounts
                      .map(
                        (account) =>
                          `<li class="informe__item">${account.email}</li>`
                      )
                      .join("")}
                </ul>
            </div>
        </div>

        <div>
                <h2 class="informe__card-title">Usuarios de la aplicación</h2>
                <table class="informe__table">
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>Apellidos</th>
                      <th>Cargo</th>
                      <th>Oficina</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${appUsers
                      .map(
                        (post) => `
                    <tr>
                      <td>${post.nombres}</td>
                      <td>${post.apellidos}</td>
                      <td>${post.cargo}</td>
                      <td>${post.oficina}</td>
                      <td>
                        <a href="${post.email}" target="_blank">
                          ${post.email}
                        </a>
                      </td>
                    </tr>
                `
                      )
                      .join("")}
            </tbody>
        </table>
            </div>
    `;
};

const renderPublicaciones = async (posts) => {
  try {
    // const posts = await requestData("/admin/postsInfo");
    content.innerHTML = `
        <div class="informe__grid">
            ${posts
              .map(
                (info) => `
                <div class="informe__card informe__post">
                    <a href="${info.url}" target="_blank">
                      <img src="${info.imageURL}" alt="Post image" class="informe__post-image">
                    </a>

                    <div class="informe__post-content">
                        <p class="informe__post-title">${info.tituloPost}</p>
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
                                <path
                                  d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3">
                                </path>
                              </svg>
                              ${info.totalLikes}
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
                              <circle cx="18" cy="5" r="3"></circle>
                              <circle cx="6" cy="12" r="3"></circle>
                              <circle cx="18" cy="19" r="3"></circle>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                              ${info.totalShares}
                            </div>

                        </div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
  } catch (error) {
    console.error("Error al cargar las publicaciones:", error);
  }
};

const renderRegistro = async () => {
  const reports = await requestData(`/admin/postsReport`);

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
                ${reports
                  .map(
                    (post) => `
                    <tr>
                        <td>${post.email}</td>
                        <td>${post.mensaje}</td>
                        <td><a href="${
                          post.url
                        }" target="_blank">Ver publicación</a></td>
                        <td>${post.nombre_grupo}</td>
                        <td>${new Date(
                          post.fecha_publicacion
                        ).toLocaleString()}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
};

// Event listeners

resumenBtn.addEventListener("click", () => {
  setActiveButton(resumenBtn);
  renderResumen();
});

publicacionesBtn.addEventListener("click", () => {
  setActiveButton(publicacionesBtn);
  renderPublicaciones(posts);
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

const infoPublicaciones = async () => {
  posts = await requestData("/admin/postsInfo");
  return posts;
};

document.querySelector("#buttonUpdate").addEventListener("click", async () => {
  const loadingContainer = showLoading("Cargando...");

  await infoPublicaciones();

  hideLoading(loadingContainer);
});

// Inicializar la página con el resumen
renderResumen();
