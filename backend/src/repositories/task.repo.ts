import { Task } from "../models/Task.js";

export const taskRepo = {
  create: (data: any) => Task.create(data),
  findById: (id: string) => Task.findById(id),
  updateById: (id: string, patch: any) => Task.findByIdAndUpdate(id, patch, { new: true }),
  deleteById: (id: string) => Task.findByIdAndDelete(id),
  list: (filter: any, sort: any) =>
    Task.find(filter)
      .sort(sort)
      .populate("creatorId", "name email")
      .populate("assignedToId", "name email")
};
