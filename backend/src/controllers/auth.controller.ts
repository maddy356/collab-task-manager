import { Request, Response, NextFunction } from "express";
import { RegisterDto, LoginDto } from "../dtos/auth.dto.js";
import { authService } from "../services/auth.service.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = RegisterDto.parse(req.body);
      const { user, token } = await authService.register(body.name, body.email, body.password);
      setAuthCookie(res, token);
      res.status(201).json({ user });
    } catch (e) { next(e); }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = LoginDto.parse(req.body);
      const { user, token } = await authService.login(body.email, body.password);
      setAuthCookie(res, token);
      res.json({ user });
    } catch (e) { next(e); }
  },

  logout(_req: Request, res: Response) {
    clearAuthCookie(res);
    res.json({ ok: true });
  }
};
