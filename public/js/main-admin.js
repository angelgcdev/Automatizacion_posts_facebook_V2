// public/js/main.js
import { showNotification } from "./utils/showNotification.js";
import { logoutUser } from "./utils/logoutUser.js";
import { requestData } from "./utils/requestData.js";

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

/**---------VARIABLES---------- */
const postsContainer = document.querySelector(".user-list");

/**---------FUNCIONES---------- */

//Funcion para mostrar la animacion de carga
const showLoading = (text) => {
  loadingContainer.innerHTML = `
  <div class="loading__spinner"></div>
  <p id="loading__text" class="loading__text">${text}</p>
  `;
  loadingContainer.classList.remove("hidden");
};

const hideLoading = () => {
  loadingContainer.classList.add("hidden");
};



/**---------LISTENERS---------- */
const cargarEventListeners = () => {
};

//Llama a la funcion para cargar los listeners
cargarEventListeners();
