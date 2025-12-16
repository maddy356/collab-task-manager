import { Server } from "socket.io";
import { HttpError } from "../utils/httpError.js";
import { taskRepo } from "../repositories/task.repo.js";
import { notificationRepo } from "../repositories/notification.repo.js";

export const taskService = {
  async createTask(io: Server, creatorId: string, data: any) {
    const task = await taskRepo.create({
      ...data,
      creatorId,
      dueDate: new Date(data.dueDate)
    });

    io.emit("tasks:changed", { type: "created", taskId: String((task as any)._id) });

    const msg = `A task was assigned to you: "${task.title}"`;
    await notificationRepo.create({ userId: String(task.assignedToId), message: msg });
    io.to(`user:${String(task.assignedToId)}`).emit("notifications:new");

    return task;
  },

  async updateTask(io: Server, taskId: string, patch: any) {
    const existing = await taskRepo.findById(taskId);
    if (!existing) throw new HttpError(404, "Task not found");

    const updated = await taskRepo.updateById(taskId, {
      ...patch,
      ...(patch.dueDate ? { dueDate: new Date(patch.dueDate) } : {})
    });

    io.emit("tasks:changed", { type: "updated", taskId });

    if (patch.assignedToId && String(patch.assignedToId) !== String((existing as any).assignedToId)) {
      const msg = `A task was assigned to you: "${(updated as any)?.title || "Task"}"`;
      await notificationRepo.create({ userId: String(patch.assignedToId), message: msg });
      io.to(`user:${String(patch.assignedToId)}`).emit("notifications:new");
    }

    return updated;
  }
};
