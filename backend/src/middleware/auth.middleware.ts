import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AuthedRequest = Request & { userId?: string };

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = (req as any).cookies?.[env.COOKIE_NAME];
  if (!token) return next(Object.assign(new Error("Unauthorized"), { status: 401 }));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    next(Object.assign(new Error("Unauthorized"), { status: 401 }));
  }
}
