// public/js/register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!email || !password) {
      document.getElementById("registerMessage").innerText =
        "Por favor, completa todos los campos.";
      return;
    }

    try {
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("registerMessage").innerText =
          "Registro exitoso. Ahora puedes iniciar sesión.";
        //Limpiar el formulario
        document.getElementById("registerForm").reset();
      } else {
        document.getElementById("registerMessage").innerText = data.message;
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      document.getElementById("registerMessage").innerText =
        "Error al registrar usuario. Inténtalo de nuevo más tarde.";
    }
  });
