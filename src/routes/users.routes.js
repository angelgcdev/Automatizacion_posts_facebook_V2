// src/routes/users.routes.js
import { Router } from "express";
import {
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
  detailPost,
  totalD,
  totalP,
} from "../controllers/users.controllers.js";
// import { verifyToken } from "../middlewares/users.middlewares.js";

const router = Router();

router.get("/users", getUsers);

router.post("/users", createUser);

router.post("/login", loginUser);

router.post("/addPost", addPost);

router.get("/getPosts/:id_usuario", getPosts);

router.delete("/deletePost/:id_publicacion", deletePost);

router.put("/updatePost/:id_publicacion", updatePost);

router.post("/sharePosts/:id_usuario", sharePosts);

router.get("/totalP/:id_usuario/", totalP);

router.get("/postsReport/:id_usuario", postsReport);

router.get("/detailPost/:id_usuario/:email", detailPost);

router.get("/totalD/:id_usuario/:email", totalD);

router.delete("/deleteReport", deleteReport);

export { router };
