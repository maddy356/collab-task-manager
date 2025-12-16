import { Response, NextFunction } from "express";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { notificationRepo } from "../repositories/notification.repo.js";

export const notificationController = {
  async list(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      const items = await notificationRepo.listForUser(req.userId!);
      res.json({ notifications: items });
    } catch (e) { next(e); }
  },

  async markRead(req: AuthedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await notificationRepo.markRead(req.params.id, req.userId!);
      res.json({ notification: updated });
    } catch (e) { next(e); }
  }
};
