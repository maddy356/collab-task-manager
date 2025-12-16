import { Notification } from "../models/Notification.js";

export const notificationRepo = {
  create: (data: { userId: string; message: string }) => Notification.create(data),
  listForUser: (userId: string) => Notification.find({ userId }).sort({ createdAt: -1 }).limit(50),
  markRead: (id: string, userId: string) =>
    Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true })
};
