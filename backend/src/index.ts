import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { authRoutes } from "./routes/auth.routes.js";
import { notificationRoutes } from "./routes/notification.routes.js";
import { makeTaskRoutes } from "./routes/task.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { initSocket } from "./socket/socket.js";

async function main() {
  await connectDB();

  const app = express();
  app.set("trust proxy", 1);
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: env.CLIENT_ORIGIN, credentials: true }
  });

  initSocket(io);

  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (_req, res) => res.json({ ok: true, name: "Collaborative Task Manager API" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/tasks", makeTaskRoutes(io));

  // Global error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || 400;
    res.status(status).json({
      error: status,
      message: err.message || "Something went wrong"
    });
  });

  server.listen(env.PORT, () => console.log(`✅ Backend on http://localhost:${env.PORT}`));
}

main().catch((e) => {
  console.error("❌ Fatal:", e);
  process.exit(1);
});
