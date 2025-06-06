import * as v from 'valibot';

export const AuthUserSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  name: v.string() 
});
export type AuthUser = v.InferOutput<typeof AuthUserSchema>;

/**
 * GET /api/login
 */
export const LoginRequestSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});
export type LoginRequest = v.InferOutput<typeof LoginRequestSchema>;
export const LoginResponseSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  name: v.string() 
});
export type LoginResponse = v.InferOutput<typeof LoginResponseSchema>;

/**
 * GET /api/logout
 */
export const LogoutRequestSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});
export const LogoutResponseSchema = v.void();
export type LogoutResponse = v.InferOutput<typeof LogoutResponseSchema>;
