import { z } from "zod";

export const RegisterDto = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(6).max(72)
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const UpdateProfileDto = z.object({
  name: z.string().min(2).max(60)
});
