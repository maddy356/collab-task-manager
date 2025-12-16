import { Response, NextFunction } from "express";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto.js";
import { taskRepo } from "../repositories/task.repo.js";
import { taskService } from "../services/task.service.js";
import { Server } from "socket.io";

export function taskController(io: Server) {
  return {
    async list(req: AuthedRequest, res: Response, next: NextFunction) {
      try {
        const { status, priority, sort } = req.query as any;

        const filter: any = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const sortBy =
          sort === "dueDateAsc" ? { dueDate: 1 } :
          sort === "dueDateDesc" ? { dueDate: -1 } :
          { createdAt: -1 };

        const tasks = await taskRepo.list(filter, sortBy);
        res.json({ tasks });
      } catch (e) { next(e); }
    },

    async create(req: AuthedRequest, res: Response, next: NextFunction) {
      try {
        const body = CreateTaskDto.parse(req.body);
        const task = await taskService.createTask(io, req.userId!, body);
        res.status(201).json({ task });
      } catch (e) { next(e); }
    },

    async update(req: AuthedRequest, res: Response, next: NextFunction) {
      try {
        const patch = UpdateTaskDto.parse(req.body);
        const task = await taskService.updateTask(io, req.params.id, patch);
        res.json({ task });
      } catch (e) { next(e); }
    },

    async remove(req: AuthedRequest, res: Response, next: NextFunction) {
      try {
        await taskRepo.deleteById(req.params.id);
        io.emit("tasks:changed", { type: "deleted", taskId: req.params.id });
        res.status(204).send();
      } catch (e) { next(e); }
    }
  };
}
