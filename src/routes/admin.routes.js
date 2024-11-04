// src/routes/admin.routes.js
import { Router } from "express";

import {
  totalCG,
  adminPostsReportCurrentDay,
  sharesByDay,
  facebookAccounts,
  appUsers,
  postsReport,
  postsInfo,
} from "../controllers/admin.controllers.js";
// import { verifyToken } from "../middlewares/users.middlewares.js";

const adminRouter = Router();

// adminRouter.get("/admin/users", getUsers);

// adminRouter.post("/admin/users", createUser);

// adminRouter.post("/admin/login", loginUser);

// adminRouter.post("/admin/addPost", addPost);

// adminRouter.get("/admin/getPosts/:id_usuario", getPosts);

// adminRouter.delete("/admin/deletePost/:id_publicacion", deletePost);

// adminRouter.put("/admin/updatePost/:id_publicacion", updatePost);

// adminRouter.post("/admin/sharePosts/:id_usuario", sharePosts);

// adminRouter.get("/admin/postsReport/:id_usuario", postsReport);

adminRouter.get("/admin/totalCG", totalCG);

adminRouter.get("/admin/sharesByDay", sharesByDay);

adminRouter.get(
  "/admin/adminPostsReportCurrentDay",
  adminPostsReportCurrentDay
);

adminRouter.get("/admin/facebookAccounts", facebookAccounts);

adminRouter.get("/admin/appUsers", appUsers);

adminRouter.get("/admin/postsReport", postsReport);

adminRouter.get("/admin/postsInfo", postsInfo);
// adminRouter.get("/admin/detailPost/:id_usuario/:email", detailPost);

// adminRouter.get("/admin/totalD/:id_usuario/:email", totalD);

// adminRouter.delete("/admin/deleteReport", deleteReport);

// adminRouter.post("/admin/cancelPosts", cancelPosts);

export { adminRouter };
