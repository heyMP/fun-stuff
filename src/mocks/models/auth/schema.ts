import * as v from 'valibot';

export const AuthRequestSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

export const AuthResponseSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  name: v.string() 
});

export type AuthRequest = v.InferOutput<typeof AuthRequestSchema>;

export type AuthResponse = v.InferOutput<typeof AuthResponseSchema>;

