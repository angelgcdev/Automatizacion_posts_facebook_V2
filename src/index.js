// src/index.js
import express from "express";
import { PORT } from "./config.js";
import { router } from "./routes/users.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { createServer } from "http"; //Para usar el servidor HTTP
import { Server } from "socket.io"; // WebSockets con socket.io

//Obtener el nombre del archivo actual y su directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app); //Crea un servidor HTTP
const io = new Server(httpServer); // Vincular el servidor con socket.io
const userSockets = {};

app.use(morgan("dev")); // Logger
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); //para parsear URL-encoded
app.use(express.static(path.join(__dirname, "../public"))); // Servir archivos estaticos

app.use(router); //Usar las rutas definidas para usuarios
app.use(adminRouter); // Usar las rutas definidas para administradores

//Configurar WebSocket
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  //Escuchar el evento de registro para asociar userId con socket.id
  socket.on("register", (userId) => {
    //Guarda la relacion entre userId y socket.id
    userSockets[userId] = socket.id;
    console.log(`Usuario ${userId} registrado con socket ID ${socket.id}`);
  });

  //Evento de desconexion
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
    //Eliminar la relación cuando el cliente se desconecte
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

// Iniciar el servidor
httpServer.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}/login.html`;
  console.log(`Server running at ${baseUrl}`);
});

//Exportar 'io' para usarlo en otros archivos
export { io, userSockets };
