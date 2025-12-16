import { z } from "zod";
import { PriorityEnum, StatusEnum } from "../models/Task.js";

export const CreateTaskDto = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(5000).optional().default(""),
  dueDate: z.string().datetime(),
  priority: z.enum(PriorityEnum),
  status: z.enum(StatusEnum),
  assignedToId: z.string().min(1)
});

export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(5000).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(PriorityEnum).optional(),
  status: z.enum(StatusEnum).optional(),
  assignedToId: z.string().min(1).optional()
});
