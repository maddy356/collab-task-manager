import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { userRepo } from "../repositories/user.repo.js";

export const authService = {
  async register(name: string, email: string, password: string) {
    const existing = await userRepo.findByEmail(email);
    if (existing) throw new HttpError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepo.create({ name, email, passwordHash });

    const token = jwt.sign({ userId: String(user._id) }, env.JWT_SECRET, { expiresIn: "7d" });
    return { user: { id: String(user._id), name: user.name, email: user.email }, token };
  },

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new HttpError(401, "Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const token = jwt.sign({ userId: String(user._id) }, env.JWT_SECRET, { expiresIn: "7d" });
    return { user: { id: String(user._id), name: user.name, email: user.email }, token };
  }
};
