import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

export const runCreateSchema = z.object({
  levelId: z.number().int().positive(),
  ms_time: z.number().int().positive(),
  replay_ref: z.string().max(256).optional()
});
