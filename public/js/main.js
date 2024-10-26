import { showNotification } from "./utils/showNotification.js";
import { togglePasswordVisibility } from "./utils/togglePasswordVisibility.js";
import { logoutUser } from "./utils/logoutUser.js";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const userEmail = localStorage.getItem("userEmail");

const logout_button = document.getElementById("logoutButton");

if (!token) {
  //Si no hay token, redirigir a la pagina de login
  window.location.href = "../login.html";
}

// public/js/automation.js

/**---------VARIABLES---------- */
const titleReport = document.querySelector("#title_report");

const loadingElement = document.querySelector("#loading");

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
const showLoading = () => {
  loadingElement.classList.remove("hidden");
};

const hideLoading = () => {
  loadingElement.classList.add("hidden");
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
    showNotification("Se produjo un error durante la solicitud.", false);
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
  document.querySelector("#editOldEmail").value = post.email;
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

    //Limpiar el contenido actual
    reportContent.innerHTML = "";

    reportContent.innerHTML = `
      <div container-title__detail>
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
          <th>Mensaje</th>
          <th>URL</th>
          <th>Nombre del Grupo</th>
          <th>Fecha de Publicación</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    //Agregar las filas de datos
    detail.forEach((post) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="report-post__text">
          ${post.mensaje}
        </td>
        <td class="report-post__text">
          <a href="${post.url}" target="_blank">${post.url}</a>
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
    console.log(error);
    showNotification("Error al cargar el reporte.", false);
  }
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

//Funcion para cargar y mostrar usuarios
const loadPosts = async () => {
  const posts = await requestData(`/getPosts/${userId}`);

  if (posts) {
    postList.innerHTML = ""; //Limpiar
    let userCount = 0; //Variable para contar usuarios

    posts.forEach((post) => {
      const articlePost = document.createElement("article");
      articlePost.classList.add("user-list__item");

      articlePost.innerHTML = `
        <p class="user-list__item-email user-list__span">
          ${post.email}
        </p>

        <img class="article__post-img" src="${post.urlimg}">

        <p class="user-list__item-message user-list__span">
          ${post.mensaje}
        </p>

        <p class="user-list__item-posts user-list__span">
          ${post.numero_de_posts}
        </p>

        <p class="user-list__item-posts user-list__span">
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
    });

    // posts.forEach((post) => {
    //   const listItem = document.createElement("li");
    //   listItem.classList.add("user-list__item");

    //   const emailSpan = document.createElement("span");
    //   emailSpan.classList.add("user-list__item-email", "user-list__span");
    //   emailSpan.textContent = `${post.email}`;
    //   listItem.appendChild(emailSpan);

    //   const postImg = document.createElement("img");
    //   postImg.classList.add("user-list__item-posts", "user-list__span");
    //   postImg.src = post.urlimg;
    //   listItem.appendChild(postImg);

    //   const messageSpan = document.createElement("span");
    //   messageSpan.classList.add("user-list__item-message", "user-list__span");
    //   messageSpan.textContent = `Mensaje: ${post.mensaje}`;
    //   listItem.appendChild(messageSpan);

    //   const postsSpan = document.createElement("span");
    //   postsSpan.classList.add("user-list__item-posts", "user-list__span");
    //   postsSpan.textContent = `Publicaciones Programadas: ${post.numero_de_posts}`;
    //   listItem.appendChild(postsSpan);

    //   const intervalSpan = document.createElement("span");
    //   intervalSpan.classList.add("user-list__item-posts", "user-list__span");
    //   intervalSpan.textContent = `Una publicacion cada: ${post.intervalo_tiempo} minutos`;
    //   listItem.appendChild(intervalSpan);

    //   listItem.appendChild(createEditButton(post, post.id));
    //   listItem.appendChild(createDeleteButton(post.id_publicacion));
    //   listItem.appendChild(createDetailPostButton(post.id_usuario, post.email));

    //   postList.appendChild(listItem);

    //   userCount++;
    // });

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
    showNotification("La cuenta se ha añadido correctamente.");
    event.target.reset(); //Limpiar el formulario después de añadir el usuario
    loadPosts(); // Recargar la lista de usuarios
  } else {
    showNotification(
      "Hubo problemas al añadir la cuenta. Por favor, inténtelo de nuevo",
      false
    );
  }
};

//Funcion para compartir publicaciones
const sharePosts = async () => {
  showLoading(); //Muestra la animacion de carga

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await requestData(`/sharePosts/${userId}`, options);

    if (response) {
      showNotification("Las publicaciones se han compartido correctamente.");
    } else {
      showNotification("Hubo un problema al compartir las publiciones.", false);
    }
  } catch (error) {
    showNotification("Hubo un problema al compartir las publiciones.", false);
  } finally {
    hideLoading(); //Oculta la animacion de carga
    openReportModal(); //Muestra el reporte al finalizar
  }
};

//Función para editar un usuario
const editPost = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    id_publicacion: formData.get("id_post"),
    id_usuario: formData.get("id_usuario"),
    email: formData.get("email"),
    password: formData.get("password"),
    url: formData.get("urlPost"),
    mensaje: formData.get("message"),
    numero_de_posts: parseInt(formData.get("postCount"), 10) || 1,
    intervalo_tiempo: parseInt(formData.get("postInterval"), 10) || 0,
    oldEmail: formData.get("oldEmail"),
  };

  console.log("Borrame id_post:", data.id_publicacion);

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
    showNotification("La cuenta se ha actualizado correctamente.");
    closeEditModal();
    loadPosts(); //Recargar la lista de usuarios
  } else {
    showNotification(
      "Hubo problemas al actualizar la cuenta. Por favor, inténtelo de nuevo",
      false
    );
  }
};

//Función para abrir el modal del reporte
const openReportModal = async () => {
  try {
    const reports = await requestData(`/postsReport/${userId}`);

    const total_p = await requestData(`/totalP/${userId}`);

    const reports_day = await requestData(`/postsReportDay/${userId}`);

    console.log(reports_day);
    console.log(reports);

    //Limpiar el contenido previo
    reportContent.innerHTML = "";

    //Titulo del reporte
    titleReport.textContent = "Historial de publicaciones";

    reportContent.innerHTML = `
      <div class="container-title__detail">
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
          <th>Email</th>
          <th>Mensaje</th>
          <th>URL</th>
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
            <a href="${post.url}" target="_blank">${post.url}</a>
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

//Cargar los usuarios cuando el contenido del DOM esté completamente cargado
loadPosts();

//Llama a la funcion para cargar los listeners
cargarEventListeners();
