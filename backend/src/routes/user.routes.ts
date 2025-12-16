import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { userController } from "../controllers/user.controller.js";

export const userRoutes = Router();
userRoutes.get("/me", requireAuth, userController.me);
userRoutes.put("/me", requireAuth, userController.updateProfile);
userRoutes.get("/", requireAuth, userController.list);
