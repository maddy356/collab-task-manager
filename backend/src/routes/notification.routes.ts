import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { notificationController } from "../controllers/notification.controller.js";

export const notificationRoutes = Router();
notificationRoutes.get("/", requireAuth, notificationController.list);
notificationRoutes.post("/:id/read", requireAuth, notificationController.markRead);
