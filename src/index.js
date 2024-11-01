// src/index.js
import express from "express";
import { PORT } from "./config.js";
import { router } from "./routes/users.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

//Obtener el nombre del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(morgan("dev")); // Logger
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); //para parsear URL-encoded
app.use(express.static(path.join(__dirname, "../public"))); // Servir archivos estaticos

app.use(router); //Usar las rutas definidas para usuarios
app.use(adminRouter); // Usar las rutas definidas para administradore

app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}/login.html`;
  console.log(`Server running at ${baseUrl}`);
});
