// src/controllers/users.controllers.js

import { pool } from "../db.js";
import { postInformation } from "../automation/postInformation.js";

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import {
//   automatizarFacebook,
//   cancelAutomation,
// } from "../automation/facebookAutomation.js";
// import { postImg } from "../automation/postImg.js";

/************VARIABLES***********/
// const saltRounds = 10;
// let isCanceled = false;

// const getUsers = async (req, res) => {
//   const { rows } = await pool.query("SELECT * FROM usuarios;");
//   res.json(rows);
// };

// const createUser = async (req, res) => {
//   try {
//     const { email, password, is_admin = false } = req.body;

//     //Encriptar la contraseña
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const { rows } = await pool.query(
//       "INSERT INTO usuarios (email, password, is_admin) VALUES ($1, $2, $3) RETURNING *",
//       [email, hashedPassword, is_admin]
//     );
//     return res.json(rows[0]);
//   } catch (error) {
//     console.log(error);

//     if (error?.code === "23505") {
//       return res
//         .status(409)
//         .json({ message: "El correo ya ha sido registrado." }); // estado 409 indica conflicto entre datos
//     }
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   //Buscar el usuario por email
//   const { rows } = await pool.query("SELECT * FROM usuarios WHERE email = $1", [
//     email,
//   ]);

//   if (rows.length === 0) {
//     return res.status(401).json({ message: "No existe la cuenta" });
//   }

//   const user = rows[0];

//   //Comparar la contraseña
//   const match = await bcrypt.compare(password, user.password);
//   if (!match) {
//     return res.status(401).json({ message: "Contraseña invalida" });
//   }

//   //Crear un token JWT
//   const token = jwt.sign(
//     { id: user.id_usuario, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );

//   res.json({
//     token,
//     id_usuario: user.id_usuario,
//     email: user.email,
//     is_admin: user.is_admin,
//   });
// };

// const addPost = async (req, res) => {
//   try {
//     const {
//       id_usuario,
//       email,
//       password,
//       url,
//       mensaje,
//       numero_de_posts,
//       intervalo_tiempo,
//     } = req.body;

//     const urlImg = await postImg({ url });
//     console.log("URL de imagen: ", urlImg);

//     const { rows } = await pool.query(
//       "INSERT INTO publicaciones (id_usuario, email, password, url, urlImg, mensaje, numero_de_posts, intervalo_tiempo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
//       [
//         id_usuario,
//         email,
//         password,
//         url,
//         urlImg,
//         mensaje,
//         numero_de_posts,
//         intervalo_tiempo,
//       ]
//     );
//     return res.status(200).json({ message: "Publicación añadida con éxito." });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: "Se produjo un error al añadir la publicación." });
//   }
// };

// const getPosts = async (req, res) => {
//   try {
//     const { id_usuario } = req.params;
//     const { rows } = await pool.query(
//       "SELECT * FROM publicaciones WHERE id_usuario=$1;",
//       [id_usuario]
//     );
//     return res.status(200).json(rows);
//   } catch (error) {
//     console.log("Error al obtener la lista de usuarios:", error);

//     return res.status(500).json({
//       message: "Se produjo un error al obtener la lista de usuarios.",
//     });
//   }
// };

// const deletePost = async (req, res) => {
//   try {
//     const { id_publicacion } = req.params;
//     const { rowCount } = await pool.query(
//       "DELETE FROM publicaciones WHERE id_publicacion = $1 RETURNING *",
//       [id_publicacion]
//     );

//     if (rowCount === 0) {
//       return res.status(404).json({ message: "Publicación no encontrada." });
//     }

//     res
//       .status(200)
//       .json({ message: "La publicación ha sido eliminado con éxito." });
//   } catch (error) {
//     console.error("Error durante la eliminacion de la publicación:", error);

//     res
//       .status(500)
//       .json({ message: "Se produjo un error al eliminar la publicación." });
//   }
// };

// const updatePost = async (req, res) => {
//   try {
//     const { id_publicacion } = req.params;
//     const { email, password, url, mensaje, numero_de_posts, intervalo_tiempo } =
//       req.body;

//     const urlImg = await postImg({ url });
//     console.log("URL de imagen: ", urlImg);

//     const { rows } = await pool.query(
//       "UPDATE publicaciones SET email = $1, password = $2, url = $3, urlImg = $4, mensaje = $5, numero_de_posts = $6, intervalo_tiempo = $7 WHERE id_publicacion= $8 RETURNING *",
//       [
//         email,
//         password,
//         url,
//         urlImg,
//         mensaje,
//         numero_de_posts,
//         intervalo_tiempo,
//         id_publicacion,
//       ]
//     );

//     return res
//       .status(200)
//       .json({ message: "Publicación actualizada con éxito." });
//   } catch (error) {
//     console.error("Error durante la actualización de la publicación:", error);

//     return res
//       .status(500)
//       .json({ message: "Se produjo un error al actualizar la publicación." });
//   }
// };

// const sharePosts = async (req, res) => {
//   try {
//     //Reiniciar el estado de cancelacion al iniciar la solicitud
//     isCanceled = false;

//     const { id_usuario } = req.params;

//     const { rows } = await pool.query(
//       "SELECT * FROM publicaciones WHERE id_usuario=$1;",
//       [id_usuario]
//     );

//     for (const post of rows) {
//       if (isCanceled) {
//         res.status(200).json({ message: "Publicaciones canceladas" });
//         return;
//       }
//       try {
//         await automatizarFacebook(post);
//       } catch (error) {
//         console.log(
//           `Error al automatizar publicaciones de: ${post.email}`,
//           error
//         );
//       }
//     }

//     return res.status(200).json({
//       message: "Automatización de posts completada con éxito.",
//     });
//   } catch (error) {
//     console.log("Error durante sharePosts:", error);
//     return res.status(500).json({
//       message: "Se produjo un error durante la automatización de posts.",
//     });
//   }
// };

const totalCG = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) as total_compartidas_global FROM reportes;"
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "No se pudo obtener el resultado." });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el total.");
    return res.status(500).json({
      message: "Se produjo un error al obtener el total.",
    });
  }
};

const sharesByDay = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DATE_TRUNC('day', fecha_publicacion) AS dia, COUNT(*) AS total_publicaciones 
      FROM reportes 
      GROUP BY DATE_TRUNC('day', fecha_publicacion) 
      ORDER BY dia DESC;`);

    if (rows.length === 0) {
      return res.status(400).json({ message: "reporte diario no encontrado" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener el reporte diario de publicaciones.");
    return res.status(500).json({
      message:
        "Se produjo un error al obtener el reporte diario de publicaciones.",
    });
  }
};

const adminPostsReportCurrentDay = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT DATE_TRUNC('day', fecha_publicacion) AS dia, COUNT(*) AS total_publicaciones FROM reportes WHERE DATE_TRUNC('day', fecha_publicacion) = CURRENT_DATE GROUP BY DATE_TRUNC('day', fecha_publicacion) ORDER BY dia DESC;"
    );

    //Si no hay publicaciones para hoy, devolvemos un conteo de 0
    if (rows.length === 0) {
      return res.status(200).json({
        dia: new Date().toISOString().split("T")[0],
        total_publicaciones: 0,
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el total de publicaciones diarias.");
    return res.status(500).json({
      message:
        "Se produjo un error al obtener el total de publicaciones diarias.",
    });
  }
};

const facebookAccounts = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT DISTINCT email FROM reportes;");

    if (rows === 0) {
      return res.status(400).json({ message: "cuentas no encontradas." });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener el reporte de publicaciones.");
    return res.status(500).json({
      message: "Se produjo un error al obtener las cuentas de facebook",
    });
  }
};

const appUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
    SELECT 
	    u.nombres,
 	    u.apellidos,
 	    u.oficina,
 	    u.email,
 	    c.nombre AS cargo,
      COALESCE(COUNT(r.id_reporte), 0) AS total_compartidas
    FROM
	    usuarios u
    JOIN
	    cargos c ON u.id_cargo = c.id_cargo
    JOIN
	    reportes r ON u.id_usuario = r.id_usuario
    GROUP BY
	    u.id_usuario, c.nombre;
      `);

    if (rows === 0) {
      return res.status(400).json({ message: "usuarios no encontrados." });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener los usuarios de la aplicación.");
    return res.status(500).json({
      message: "Se produjo un error al obtener los usuarios de la aplicación.",
    });
  }
};

const postsReport = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM reportes;");

    if (rows.length === 0) {
      return res.status(400).json({ message: "publicaciones no encontradas" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener el reporte de publicaciones.");
    return res.status(500).json({
      message: "Se produjo un error al obtener el reporte de publicaciones.",
    });
  }
};

const postsInfo = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT DISTINCT url FROM reportes;");

    // Maneja el caso de no encontrar URLs
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron ls URLs de las  publicaciones." });
    }

    const publicacionesInfo = [];

    for (const row of rows) {
      try {
        const info = await postInformation(row.url);
        publicacionesInfo.push(info);
      } catch (error) {
        console.log(
          `Error al obtener información para la URL: ${row.url}`,
          error
        );
      }
    }

    return res.status(200).json(publicacionesInfo);
  } catch (error) {
    console.error(
      "Error al obtener las URLs de las imagenes de las publiciones",
      error
    );
    return res.status(500).json({
      message: "Se produjo un error al obtener las URLs de la publicaciones.",
    });
  }
};

// const detailPost = async (req, res) => {
//   try {
//     const { id_usuario, email } = req.params;
//     const { rows } = await pool.query(
//       "SELECT * FROM reportes WHERE id_usuario= $1 AND email= $2;",
//       [id_usuario, email]
//     );

//     if (rows.length === 0) {
//       return res.status(400).json({ message: "Publicaciones no encontradas" });
//     }

//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error("Error al obtener el reporte de publicaciones.");
//     return res.status(500).json({
//       message: "Se produjo un error al obtener el reporte de publicaciones",
//     });
//   }
// };

// const totalD = async (req, res) => {
//   try {
//     const { id_usuario, email } = req.params;
//     const { rows } = await pool.query(
//       "SELECT COUNT(*) FROM reportes WHERE id_usuario= $1 AND email= $2;",
//       [id_usuario, email]
//     );

//     if (rows.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "No se pudo obtener el resultado." });
//     }

//     return res.status(200).json(rows);
//   } catch (error) {
//     console.error("Error al obtener el total.");
//     return res.status(500).json({
//       message: "Se produjo un error al obtener el total.",
//     });
//   }
// };

// const deleteReport = async (req, res) => {
//   try {
//     const { rowCount } = await pool.query("DELETE FROM reportes RETURNING *");

//     return res.status(200).json({ message: "Reporte eliminado con éxito." });
//   } catch (error) {
//     console.error("Error durante la eliminacion del reporte:", error);
//     return res
//       .status(500)
//       .json({ message: "Se produjo un error al eliminar el Reporte." });
//   }
// };

// const cancelPosts = async (req, res) => {
//   try {
//     cancelAutomation();

//     isCanceled = true;
//     console.log("Publicaciones canceladas. Estado:", isCanceled);
//     return res
//       .status(200)
//       .json({ message: "Publicaciones canceladas exitosamente." });
//   } catch (error) {
//     console.log("Error al cancelar las publicaciones.", error);
//     return res
//       .status(500)
//       .json({ message: "Error al cancelar las publicaciones." });
//   }
// };

export {
  totalCG,
  sharesByDay,
  adminPostsReportCurrentDay,
  facebookAccounts,
  appUsers,
  postsReport,
  postsInfo,
};