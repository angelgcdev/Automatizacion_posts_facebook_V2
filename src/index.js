// src/index.js
import express from "express";
import { PORT } from "./config.js";
import { router } from "./routes/users.routes.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

//Obtener el nombre del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(router);

app.listen(PORT);
console.log("Server on port", PORT);
