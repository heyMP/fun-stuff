import { Valimock } from 'valimock';
import * as Schema from './schema.js';

export function createLoginResponse(req: Schema.LoginRequest): Schema.LoginResponse {
  const res = new Valimock().mock(Schema.LoginResponseSchema);
  if (req) {
    res.email = req.email;
  }
  return res;
}

export function createLogoutResponse(): Schema.LogoutResponse {
  return;
}
