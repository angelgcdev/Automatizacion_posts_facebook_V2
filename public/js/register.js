import { showNotification } from "./utils/showNotification.js";
import { togglePasswordVisibility } from "./utils/togglePasswordVisibility.js";
import { requestData } from "./utils/requestData.js";

// public/js/register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!email || !password) {
      showNotification("Por favor, completa todos los campos.", false);
      return;
    }

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      const response = await requestData("/users", options);

      if (response) {
        showNotification("Registro exitoso. Ahora puedes iniciar sesión.");
        //Limpiar el formulario
        document.getElementById("registerForm").reset();
      } else {
        showNotification(response.message, false);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      showNotification(
        "Error al registrar usuario. Inténtalo de nuevo más tarde.",
        false
      );
    }
  });

/**---------LISTENERS---------- */
const cargarEventListeners = () => {
  //Toggle button para contraseñas
  document
    .querySelector(".button__toggle-icon")
    .addEventListener("click", togglePasswordVisibility);
};

//Llama a la funcion para cargar los listeners
cargarEventListeners();
