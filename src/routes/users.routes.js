// src/routes/users.routes.js
import { Router } from "express";
import {
  getUsers,
  createUser,
  loginUser,
} from "../controllers/users.controllers.js";
// import { verifyToken } from "../middlewares/users.middlewares.js";

const router = Router();

router.get("/users", getUsers);

// router.get("/users/:id", getUser);

router.post("/users", createUser);

router.post("/login", loginUser);

// router.delete("/users/:id", deleteUser);

// router.put("/users/:id", updateUser);

export { router };
