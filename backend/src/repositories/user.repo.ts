import { User } from "../models/User.js";

export const userRepo = {
  findByEmail: (email: string) => User.findOne({ email }),
  findById: (id: string) => User.findById(id),
  list: () => User.find().sort({ createdAt: -1 }).select("name email"),
  create: (data: { name: string; email: string; passwordHash: string }) => User.create(data),
  updateName: (id: string, name: string) => User.findByIdAndUpdate(id, { name }, { new: true })
};
