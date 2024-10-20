// src/controllers/users.controllers.js
import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { automatizarFacebook } from "../facebookAutomation.js";
// import { cleanText } from "../utils/cleanText.js";

const saltRounds = 10;

const getUsers = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM usuarios;");
  res.json(rows);
};

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { rows } = await pool.query(
      "INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
    return res.json(rows[0]);
  } catch (error) {
    console.log(error);

    if (error?.code === "23505") {
      return res.status(409).json({ message: "Email already exists" }); // estado 409 indica conflicto entre datos
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //Buscar el usuario por email
  const { rows } = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
    email,
  ]);

  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = rows[0];

  //Comparar la contraseña
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //Crear un token JWT
  const token = jwt.sign(
    { id: user.id_usuario, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, user: { id_usuario: user.id_usuario, email: user.email } });
};

const addPost = async (req, res) => {
  try {
    const {
      id_usuario,
      email,
      password,
      url,
      mensaje,
      numero_de_posts,
      intervalo_tiempo,
    } = req.body;

    //Limpiar el texto antes de insertarlo
    // const cleanEmail = cleanText(email);
    // const cleanUrl = cleanText(url);
    // const cleanMensaje = cleanText(mensaje);

    const { rows } = await pool.query(
      "INSERT INTO publicaciones (id_usuario, email, password, url, mensaje, numero_de_posts, intervalo_tiempo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        id_usuario,
        email,
        password,
        url,
        mensaje,
        numero_de_posts,
        intervalo_tiempo,
      ]
    );
    return res.status(200).json({ message: "Usuario añadido con éxito." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Se produjo un error al añadir el usuario." });
  }
};

const getPosts = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM publicaciones WHERE id_usuario=$1;",
      [id_usuario]
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.log("Error al obtener la lista de usuarios:", error);

    return res.status(500).json({
      message: "Se produjo un error al obtener la lista de usuarios.",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id_publicacion } = req.params;
    const { rowCount } = await pool.query(
      "DELETE FROM publicaciones WHERE id_publicacion = $1 RETURNING *",
      [id_publicacion]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    res
      .status(200)
      .json({ message: "La publicación ha sido eliminado con éxito." });
  } catch (error) {
    console.error("Error durante la eliminacion de la publicación:", error);

    res
      .status(500)
      .json({ message: "Se produjo un error al eliminar la publicación." });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id_publicacion } = req.params;
    const data = req.body;

    const { rows } = await pool.query(
      "UPDATE publicaciones SET email=$1, password=$2, url=$3, mensaje=$4, numero_de_posts=$5, intervalo_tiempo=$6 WHERE id_publicacion= $7 RETURNING *",
      [
        data.email,
        data.password,
        data.url,
        data.mensaje,
        data.numero_de_posts,
        data.intervalo_tiempo,
        id_publicacion,
      ]
    );

    return res
      .status(200)
      .json({ message: "Publicación actualizada con éxito." });
  } catch (error) {
    console.error("Error durante la actualización de la cuenta:", error);

    return res
      .status(500)
      .json({ message: "Se produjo un error al actualizar la publicación." });
  }
};

const sharePosts = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM publicaciones WHERE id_usuario=$1;",
      [id_usuario]
    );

    for (const post of rows) {
      try {
        await automatizarFacebook(post);
      } catch (error) {
        console.log(
          `Error al automatizar publicaciones de: ${post.email}`,
          error
        );
      }
    }

    return res.status(200).json({
      message: "Automatización de posts completada con éxito.",
    });
  } catch (error) {
    console.log("Error durante sharePosts:", error);
    return res.status(500).json({
      message: "Se produjo un error durante la automatización de posts.",
    });
  }
};

const postsReport = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM reportes WHERE id_usuario = $1;",
      [id_usuario]
    );

    if(rows.length === 0){
      return res.status(400).json({message: "publicaciones no encontradas"})
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener el reporte de publicaciones.");
    return res.status(500).json({
      message: "Se produjo un error al obtener el reporte de publicaciones.",
    });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { rowCount } = await pool.query("DELETE FROM reportes RETURNING *");

    return res.status(200).json({ message: "Reporte eliminado con éxito." });
  } catch (error) {
    console.error("Error durante la eliminacion del reporte:", error);
    return res
      .status(500)
      .json({ message: "Se produjo un error al eliminar el Reporte." });
  }
};

export {
  getUsers,
  createUser,
  loginUser,
  addPost,
  getPosts,
  deletePost,
  updatePost,
  sharePosts,
  postsReport,
  deleteReport,
};
