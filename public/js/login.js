import { togglePasswordVisibility } from "./utils/togglePasswordVisibility.js";
import { showNotification } from "./utils/showNotification.js";

const login_form = document.getElementById("loginForm");

login_form.addEventListener("submit", async (e) => {
  //Obtener los valores de los campos de entrada
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  e.preventDefault();

  //Verificar que los campos no esten vacios
  if (!email || !password) {
    showNotification("Por favor, completa todos los campos", false);
    return;
  }

  try {
    //Realizar la solicitud de inicio de sesión
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    //Manejar la respuesta de la API
    if (response.ok) {
      //Guardar el token en el localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id_usuario);
      localStorage.setItem("userEmail", data.user.email);
      //Redirigir a la pagina principal o donde desees
      window.location.href = "../main.html";
    } else {
      //Mostrar el mensaje de error
      showNotification(data.message, false);
    }
  } catch (error) {
    //Manejo de errores de red o de otro tipo
    console.error("Error al iniciar sesión:", error);
    showNotification(
      "Error al iniciar sesión, Intentalo de nuevo más tarde.",
      false
    );
  }
});

/**---------LISTENERS---------- */
const cargarEventListeners = () => {
  document
    .querySelector(".button__toggle-icon")
    .addEventListener("click", togglePasswordVisibility);
};

cargarEventListeners();
