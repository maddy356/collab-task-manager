import { Response, NextFunction } from "express";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { UpdateProfileDto } from "../dtos/auth.dto.js";
import { userRepo } from "../repositories/user.repo.js";

export const userController = {
  async me(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      const user = await userRepo.findById(req.userId!);
      res.json({ user: user ? { id: String(user._id), name: user.name, email: user.email } : null });
    } catch (e) { next(e); }
  },

  async updateProfile(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      const body = UpdateProfileDto.parse(req.body);
      const user = await userRepo.updateName(req.userId!, body.name);
      res.json({ user: user ? { id: String(user._id), name: user.name, email: user.email } : null });
    } catch (e) { next(e); }
  },

  async list(_req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      const users = await userRepo.list();
      res.json({ users });
    } catch (e) { next(e); }
  }
};
