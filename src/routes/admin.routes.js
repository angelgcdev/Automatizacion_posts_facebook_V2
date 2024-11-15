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
  infoUsuario,
} from "../controllers/admin.controllers.js";

const adminRouter = Router();

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

adminRouter.get("/admin/infoUsuario/:id_usuario", infoUsuario);

export { adminRouter };
