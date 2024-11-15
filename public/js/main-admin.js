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

let posts = [];

// Elementos del DOM

const searchInput = document.getElementById("search__posts-input");

const content = document.getElementById("content");
const resumenBtn = document.getElementById("resumenBtn");
const publicacionesBtn = document.getElementById("publicacionesBtn");
const registroBtn = document.getElementById("registroBtn");

// Funciones para renderizar contenido
const renderResumen = async () => {
  //Ocultar el buscador
  searchInput.classList.add("hidden");

  const totalCG = await requestData("/admin/totalCG");
  const sharesByDay = await requestData("/admin/sharesByDay");
  const facebookAccounts = await requestData("/admin/facebookAccounts");
  const appUsers = await requestData("/admin/appUsers");

  content.innerHTML = `
        <div class="table__container">
          <h2 class="informe__card-title">Usuarios de la aplicación</h2>
            <table class="informe__table">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Cargo</th>
                  <th>Oficina</th>
                  <th>Email</th>
                  <th>Total Compartidas</th>
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
                  <td>
                    ${post.total_compartidas}
                  </td>
                </tr>
                `
                )
                .join("")}
              </tbody>
            </table>
          </div>

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
    `;
};

const renderPublicaciones = async (searchTerm = "") => {
  //Mostrar el buscador
  searchInput.classList.remove("hidden");

  try {
    //Obtener las publicaciones desde localStorage
    const posts = localStorage.getItem("posts_V1");
    if (!posts) {
      content.innerHTML = "<p>No hay publicaciones disponibles.</p>";
      return;
    }

    let parsedPosts = JSON.parse(posts);

    //Filtrar publicaciones por el término de búsqueda
    const filteredPosts = parsedPosts.filter((post) =>
      post.tituloPost.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //Si no hay publicaciones que coincidan, mostrar un mensaje
    if (filteredPosts.length === 0) {
      content.innerHTML = "<p>No se encontraron publicaciones.</p>";
      return;
    }

    content.innerHTML = `
    <!-- Buscador de publicaciones -->
        <div class="informe__grid">
            ${filteredPosts
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
  //Mostrar el buscador
  searchInput.classList.add("hidden");

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

// //Funcion para crear boton detail
// const createButtonDetail = () => {
//   const buttonDetail = document.createElement("button");
//   buttonDetail.classList.add("button--detail");

//   const iconoDetail = document.createElement("img");
//   iconoDetail.src = "../assets/icons/data_thresholding.svg";
//   iconoDetail.classList.add("icon__button");

//   buttonDetail.appendChild(iconoDetail);

//   buttonDetail.addEventListener("click", () => {
//     console.log("diste click...");
//   });

//   return buttonDetail;
// };

// Event listeners

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim();
  console.log(searchTerm);

  renderPublicaciones(searchTerm);
});

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

const infoPublicaciones = async () => {
  posts = await requestData("/admin/postsInfo");

  //Limpiamos el localStorage
  localStorage.removeItem("posts_V1");

  //Guardamos los datos de las publicaciones en localStorage
  localStorage.setItem("posts_V1", JSON.stringify(posts));

  return posts;
};

document.querySelector("#buttonUpdate").addEventListener("click", async () => {
  const loadingContainer = showLoading("Cargando...");

  await infoPublicaciones();

  hideLoading(loadingContainer);
});

// Inicializar la página con el resumen
renderResumen();
