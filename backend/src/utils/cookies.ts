import { Response } from "express";
import { env } from "../config/env.js";

export function setAuthCookie(res: Response, token: string) {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure: env.SECURE_COOKIE,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: "none",
    secure: env.SECURE_COOKIE
  });
}
