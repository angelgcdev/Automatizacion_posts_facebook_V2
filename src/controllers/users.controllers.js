// src/controllers/users.controllers.js
import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const getUsers = async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM usuarios");
  res.json(rows);
};

// const getUser = async (req, res) => {
//   const { id } = req.params;
//   const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

//   if (rows.length === 0) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   res.json(rows[0]);
// };

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

// const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   const { rowCount } = await pool.query(
//     "DELETE FROM users WHERE id= $1 RETURNING *",
//     [id]
//   );

//   if (rowCount === 0) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   return res.sendStatus(204);
// };

// const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const data = req.body;

//   const hashedPassword = await bcrypt.hash(data.password, saltRounds);

//   const { rows } = await pool.query(
//     "UPDATE users SET name= $1, email=$2, password=$3 WHERE id = $4 RETURNING *",
//     [data.name, data.email, hashedPassword, id]
//   );

//   return res.json(rows[0]);
// };

export { getUsers, createUser, loginUser };
