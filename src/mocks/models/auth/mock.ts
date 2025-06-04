import * as v from 'valibot';
import { Valimock } from "valimock";
import * as Auth from './schema.js';

export function createAuthResponse(req: any) {
  const authReq = v.safeParse(Auth.AuthRequestSchema, req);
  if (!authReq.success) {
    return authReq;
  }
  const res = new Valimock().mock(Auth.AuthResponseSchema);
  res.email = req.email;
  return res;
}
