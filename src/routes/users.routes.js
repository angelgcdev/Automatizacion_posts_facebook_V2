// src/routes/users.routes.js
import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
  addPost,
  getPosts,
  deletePost,
} from "../controllers/users.controllers.js";
// import { verifyToken } from "../middlewares/users.middlewares.js";

const router = Router();

router.get("/users", getUsers);

router.post("/users", createUser);

router.post("/login", loginUser);

router.post("/addPost", addPost);

router.get("/getPosts", getPosts);

router.get("/deletePost/:id_publicacion", deletePost);

export { router };
