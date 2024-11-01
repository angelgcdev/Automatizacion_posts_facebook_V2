// src/routes/admin.routes.js
import { Router } from "express";

import { adminPostsReportCurrentDay } from "../controllers/admin.controllers.js";
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

// adminRouter.get("/admin/totalP/:id_usuario/", totalP);

// adminRouter.get("/admin/postsReportDay/:id_usuario", postsReportDay);

adminRouter.get(
  "/admin/adminPostsReportCurrentDay",
  adminPostsReportCurrentDay
);

// adminRouter.get("/admin/detailPost/:id_usuario/:email", detailPost);

// adminRouter.get("/admin/totalD/:id_usuario/:email", totalD);

// adminRouter.delete("/admin/deleteReport", deleteReport);

// adminRouter.post("/admin/cancelPosts", cancelPosts);

export { adminRouter };
