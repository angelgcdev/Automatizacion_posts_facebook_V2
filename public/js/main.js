// public/js/main.js

import { showNotification } from "./utils/showNotification.js";
import { togglePasswordVisibility } from "./utils/togglePasswordVisibility.js";
import { logoutUser } from "./utils/logoutUser.js";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");

if (!token) {
  //Si no hay token, redirigir a la pagina de login
  window.location.href = "../login.html";
}

/**---------VARIABLES---------- */
const postsContainer = document.querySelector(".user-list");

const searchInput = document.getElementById("search__posts-input");

let controller;

const logout_button = document.getElementById("logoutButton");

const loadingText = document.getElementById("loading__text");

const titleReport = document.querySelector("#title_report");

const loadingContainer = document.querySelector("#loading");

const automationForm = document.querySelector("#automationForm");
const sharePostsButton = document.querySelector("#sharePostsButton");

const postList = document.querySelector("#posts");

const reportContent = document.querySelector("#reportContent");

const editModal = document.querySelector("#editModal");
const closeModal = document.querySelector("#closeModal");
const editForm = document.querySelector("#editForm");

const formSesion = document.querySelector(".form-sesion");

//Insertar el email del usuario que ha iniciado sesion
const emailSesion = document.createElement("p");
emailSesion.classList.add("emailSesion");
emailSesion.textContent = userEmail;
formSesion.appendChild(emailSesion);

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

//Solicita datos al servidor y maneja la respuesta
const requestData = async (url, options) => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    return response.json();
  } catch (error) {
    // showNotification("Se produjo un error durante la solicitud.", false);
    console.error(error); // para depuracion
    return null; //retornar null para evitar errores posteriores
  }
};

//Funcion para abrir el modal de edicion
const openEditModal = (post, id_publicacion) => {
  document.querySelector("#id_post").value = post.id_publicacion;
  document.querySelector("#id_usuario").value = post.id_usuario;
  document.querySelector("#editEmail").value = post.email;
  document.querySelector("#editPassword").value = post.password;
  document.querySelector("#editUrlPost").value = post.url;
  document.querySelector("#editMessage").value = post.mensaje;
  document.querySelector("#editPostCount").value = post.numero_de_posts;
  document.querySelector("#editPostInterval").value = post.intervalo_tiempo;
  // document.querySelector("#editOldEmail").value = post.email;
  editModal.style.display = "block";
};

//Funcion para cerrar el modal de edición
const closeEditModal = () => {
  editModal.style.display = "none";
};

//Funcion para manejar la eliminacion de un usuario
const handleDeletePost = async (id_publicacion) => {
  const confirmDelete = confirm(
    "¿Esta seguro de que deseas eliminar esta publicación? Esta accion no se puede deshacer."
  );
  if (confirmDelete) {
    const response = await requestData(`/deletePost/${id_publicacion}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      showNotification(response.message);
      loadPosts(); // Recargar la lista de usuarios despues de eliminar
    } else {
      showNotification(response.message, false);
    }
  }
};

//Funcion para mostrar el reporte por publicacion
const detailPost = async (id_usuario, email) => {
  try {
    const detail = await requestData(`/detailPost/${id_usuario}/${email}`);

    const total_d = await requestData(`/totalD/${id_usuario}/${email}`);

    if (!(detail && total_d)) {
      showNotification("Historial vacio");
      return;
    }

    //Limpiar el contenido actual
    reportContent.innerHTML = "";

    reportContent.innerHTML = `
      <div class="container-title__detail">
        <p class="text-detail textEmail-detail">${detail[0].email}</p>
        <p class="text-detail">Total publicaciones: ${total_d[0].count}</p>
      </div>
    `;

    //Crear la tabla y su cabecera
    const table = document.createElement("table");
    table.classList.add("report-post__table");

    table.innerHTML = `
    <thead>
        <tr>
          <th>Mensaje del Post</th>
          <th>URL del Post</th>
          <th>Nombre del Grupo</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    //Agregar las filas de datos
    detail.forEach((post) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="t_messaje">
          ${post.mensaje}
        </td>
        <td>
          <a class="t_link" href="${post.url}" target="_blank">
          Ver publicación
          </a>
        </td>
        <td class="t_name-group">
          ${post.nombre_grupo}
        </td>
        <td class="t_date">
          ${new Date(post.fecha_publicacion).toLocaleString()}
        </td>
      `;

      tbody.appendChild(row);
    });

    //Insertar la tabla en el contenido del modal
    reportContent.appendChild(table);

    document.querySelector("#reportModal").style.display = "block";
  } catch (error) {
    console.log(error);
    showNotification("Error al cargar el reporte.", false);
  }
};

//Funcion para crear el boton cancelar
const createCancelButton = () => {
  const cancelButton = document.createElement("button");
  cancelButton.classList.add("button", "button--cancel");
  cancelButton.textContent = "Cancelar";
  cancelButton.addEventListener("click", () => {
    cancelPosts();
  });
  return cancelButton;
};

//Función para crear el botón de edición
const createEditButton = (post, id_publicacion) => {
  const editButton = document.createElement("button");
  editButton.classList.add("button", "button--edit");
  editButton.textContent = "Editar";
  editButton.addEventListener("click", () =>
    openEditModal(post, id_publicacion)
  );
  return editButton;
};

//Funcion para crear un botón de eliminacion de usuario
const createDeleteButton = (id_publicacion) => {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button", "button--delete");
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () =>
    handleDeletePost(id_publicacion)
  );
  return deleteButton;
};

//Función para crear el botón de reporte
const createDetailPostButton = (id_usuario, email) => {
  const detailPostButton = document.createElement("button");
  detailPostButton.classList.add("button", "button--detail-p");
  detailPostButton.textContent = "Historial";
  detailPostButton.addEventListener("click", () =>
    detailPost(id_usuario, email)
  );
  return detailPostButton;
};

//Funcion para cancelar publicaciones
const cancelPosts = async () => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  const response = await requestData("/cancelPosts", options);

  if (response) {
    console.log("Se hiso click en cancelar");
  } else {
    console.log("No se cancelo");
  }
};

//Funcion para cargar y mostrar usuarios
const loadPosts = async (serachTerm = "") => {
  const posts = await requestData(`/getPosts/${userId}`);

  if (posts) {
    //Filtrar publicaciones si hay un termino de bùsqueda
    const filteredPosts = posts.filter((post) =>
      post.email.toLowerCase().includes(serachTerm.toLowerCase())
    );

    const reports_day = await requestData(`/postsReportDay/${userId}`);

    //Añadir total de publicaciones en la UI
    const totalPublicaciones_p = document.createElement("p");
    totalPublicaciones_p.classList.add("totalPublicaciones_p");
    totalPublicaciones_p.textContent = `Publicaciones hoy : ${reports_day[0].total_publicaciones}`;
    postsContainer.appendChild(totalPublicaciones_p);

    //Limpiar las lista de publicaciones
    postList.innerHTML = "";
    let userCount = 0; //Variable para contar usuarios

    //Rederizamos los posts
    for (const post of filteredPosts) {
      const total_d = await requestData(`/totalD/${userId}/${post.email}`);

      const articlePost = document.createElement("article");
      articlePost.classList.add("article__posts");

      articlePost.innerHTML = `
        <div class = "total__detail-container">
          <p class="total__detail-text">${total_d[0].count}</p>
        </div>
        <p class="article__posts__text">
          Correo Electrónico: <span class = "article__posts__text-span">${post.email}</span>
        </p>
        <figcaption class = "article__post-img__container">
          <img class="article__post-img" src="${post.urlimg}">
          <caption class = "article__post-img__text">Imagen de la publicación</caption>
        </figcaption>

        <p class="article__posts__text">
          Mensaje: <span class = "article__posts__text-span">${post.mensaje}</span>
        </p>

        <p class="article__posts__text">
          Cantidad de publicaciones: <span class = "article__posts__text-span">${post.numero_de_posts}</span>
        </p>

        <p class="article__posts__text">
          Una publicación cada: ${post.intervalo_tiempo} minutos
        </p>
      `;

      articlePost.appendChild(createEditButton(post, post.id));
      articlePost.appendChild(createDeleteButton(post.id_publicacion));
      articlePost.appendChild(
        createDetailPostButton(post.id_usuario, post.email)
      );

      postList.appendChild(articlePost);

      userCount++;
    }

    //Mostrar el conteo de usuarios en el UI
    const userCountDisplay = document.querySelector("#userCount");
    if (userCountDisplay) {
      userCountDisplay.textContent = `Nùmero de Cuentas: ${userCount}`;
    }
  }
};

//Funcion para añadir usuarios
const addPost = async (event) => {
  event.preventDefault();
  showLoading("Añadiendo publicación");
  const formData = new FormData(event.target);
  const data = {
    id_usuario: userId,
    email: formData.get("email"),
    password: formData.get("password"),
    url: formData.get("urlPost"),
    mensaje: formData.get("message"),
    numero_de_posts: parseInt(formData.get("postCount"), 10) || 1,
    intervalo_tiempo: parseInt(formData.get("postInterval"), 10) || 0,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const response = await requestData("/addPost", options);

  if (response) {
    showNotification(response.message);
    event.target.reset(); //Limpiar el formulario después de añadir el usuario
    loadPosts(); // Recargar la lista de usuarios
  } else {
    showNotification(response.message, false);
  }
  hideLoading();
};

//Funcion para compartir publicaciones
const sharePosts = async () => {
  showLoading("Publicando..."); //Muestra la animacion de carga

  loadingContainer.appendChild(createCancelButton());

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await requestData(`/sharePosts/${userId}`, options);

    if (response) {
      showNotification(response.message);
    } else {
      showNotification(response.message, false);
    }
  } catch (error) {
    showNotification("Hubo un problema al compartir las publiciones.", false);
  } finally {
    hideLoading(); //Oculta la animacion de carga
    openReportModal(); //Muestra el reporte al finalizar
    loadPosts();
  }
};

//Función para editar un usuario
const editPost = async (event) => {
  event.preventDefault();
  showLoading("Actualizando publicación");
  const formData = new FormData(event.target);
  const data = {
    id_publicacion: formData.get("id_post"),
    id_usuario: formData.get("id_usuario"),
    email: formData.get("editEmail"),
    password: formData.get("editPassword"),
    url: formData.get("editUrlPost"),
    mensaje: formData.get("editMessage"),
    numero_de_posts: parseInt(formData.get("editPostCount"), 10) || 1,
    intervalo_tiempo: parseInt(formData.get("editPostInterval"), 10) || 0,
    // oldEmail: formData.get("oldEmail"),
  };

  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const response = await requestData(
    `/updatePost/${data.id_publicacion}`,
    options
  );

  if (response) {
    showNotification(response.message);
    closeEditModal();
    loadPosts(); //Recargar la lista de usuarios
  } else {
    showNotification(response.message, false);
  }
  hideLoading();
};

//Función para abrir el modal del reporte
const openReportModal = async () => {
  try {
    const reports = await requestData(`/postsReport/${userId}`);

    const total_p = await requestData(`/totalP/${userId}`);

    const reports_day = await requestData(`/postsReportDay/${userId}`);

    if (!(reports && total_p && reports_day)) {
      showNotification("El reporte esta vacio");
      return;
    }

    //Limpiar el contenido previo
    reportContent.innerHTML = "";

    //Titulo del reporte
    titleReport.textContent = "Historial de publicaciones";

    reportContent.innerHTML = `
      <div class="container-title__detail container-title__total">
        <p class="text-detail">Total publicaciones: ${total_p[0].count}</p>
      </div>

      <div class="container-title__detail">
      <p class="text-detail">Publicaciones por día</p>
      </div>
    `;

    //Crear la tabla de publicaciones diarias
    const tableD = document.createElement("table");
    tableD.classList.add("report-post__table");

    tableD.innerHTML = `
      <thead>
        <tr>
          <th>Día</th>
          <th>Total Publicaciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbodyD = tableD.querySelector("tbody");

    //Agregar las filas de datos
    reports_day.forEach((reportDay) => {
      const rowD = document.createElement("tr");
      rowD.innerHTML = `
        <td class="report-post__text">
          ${new Date(reportDay.dia).toLocaleDateString("es-ES")}
        </td>
        <td class="report-post__text">
          ${reportDay.total_publicaciones}
        </td>
      `;

      tbodyD.appendChild(rowD);
    });

    //Insertar la tabla en el contenido del modal
    reportContent.appendChild(tableD);

    //Crear la tabla y su cabecera
    const table = document.createElement("table");
    table.classList.add("report-post__table");

    table.innerHTML = `
      <thead>
        <tr>
          <th>Correo de la Cuenta</th>
          <th>Mensaje del Post</th>
          <th>URL del Post</th>
          <th>Nombre del Grupo</th>
          <th>Fecha de Publicación</th>
        </tr>
      </thead>
      <tbody></tbody>
      `;

    const tbody = table.querySelector("tbody");

    //Agregar las filas de datos
    reports.forEach((post) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td class="report-post__text">
            ${post.email}
          </td>
          <td class="report-post__text">
            ${post.mensaje}
          </td>
          <td class="report-post__text">
            <a href="${post.url}" target="_blank">Ver publicación</a>
          </td>
          <td class="report-post__text">
            ${post.nombre_grupo}
          </td>
          <td class="report-post__text">
            ${new Date(post.fecha_publicacion).toLocaleString()}
          </td>
        `;

      tbody.appendChild(row);
    });

    //Insertar la tabla en el contenido del modal
    reportContent.appendChild(table);

    document.querySelector("#reportModal").style.display = "block";
  } catch (error) {
    showNotification("Error al cargar el reporte:", false);
  }
};

//Funcion para cerrar el modal del reporte
const closeReportModal = () => {
  document.querySelector("#reportModal").style.display = "none";
};

//Funcion para eliminar el reporte de publicaciones
const deleteReport = async () => {
  const confirmDelete = confirm(
    "¿Esta seguro de que deseas eliminar esta el Reporte? Esta accion no se puede deshacer."
  );
  if (confirmDelete) {
    const response = await requestData("/deleteReport", { method: "DELETE" });
    if (response) {
      showNotification(response.message);
      openReportModal(); // Recargar el reporte despues de eliminar
    } else {
      showNotification(response.message, false);
    }
  }
};

/**---------LISTENERS---------- */

const cargarEventListeners = () => {
  searchInput.addEventListener("input", () => {
    const serachTerm = searchInput.value.trim();
    console.log(serachTerm);

    loadPosts(serachTerm);
  });

  //Cargar los usuarios cuando el contenido del DOM esté completamente cargado
  loadPosts();

  //Cerrar sesion
  logout_button.addEventListener("click", logoutUser);

  //Dispara cuando se hace click en añadir cuenta
  automationForm.addEventListener("submit", addPost);

  //Toggle button para contraseñas
  document
    .querySelector(".button__toggle-icon")
    .addEventListener("click", togglePasswordVisibility);

  //Dispara cuando se hace click en share posts
  sharePostsButton.addEventListener("click", sharePosts);

  //Se dispara cuando se hace click en el boton "Guardar Cambios"
  editForm.addEventListener("submit", editPost);

  //Se dispara cuando se hace click en cerrar el modal
  closeModal.addEventListener("click", closeEditModal);

  //Se dispara cuando se hace click fuera del modal
  window.addEventListener("click", (event) => {
    if (event.target === editModal) {
      closeEditModal();
    }
  });

  //se dispara cuando se hace click en en el boton 'Ver Reporte'
  document
    .querySelector("#viewReportButton")
    .addEventListener("click", openReportModal);

  //Se dispara cuando se hace click en el boton 'Eliminar Reporte'
  document
    .querySelector("#deleteReportButton")
    .addEventListener("click", deleteReport);

  //Se dispara cuando se hace click en el boton 'X' del reportModal
  document
    .querySelector("#closeReportModal")
    .addEventListener("click", closeReportModal);

  //Cerrar el modal si se hace click fuera de el
  window.addEventListener("click", (event) => {
    if (event.target === document.querySelector("#reportModal")) {
      closeReportModal();
    }
  });
};

//Llama a la funcion para cargar los listeners
cargarEventListeners();
