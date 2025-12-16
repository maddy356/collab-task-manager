import { Server } from "socket.io";

export function initSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join", ({ userId }: { userId: string }) => {
      socket.join(`user:${userId}`);
    });
  });
}
