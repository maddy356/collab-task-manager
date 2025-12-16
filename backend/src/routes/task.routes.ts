import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { taskController } from "../controllers/task.controller.js";
import { Server } from "socket.io";

export function makeTaskRoutes(io: Server) {
  const routes = Router();
  const c = taskController(io);

  routes.get("/", requireAuth, c.list);
  routes.post("/", requireAuth, c.create);
  routes.put("/:id", requireAuth, c.update);
  routes.delete("/:id", requireAuth, c.remove);

  return routes;
}
