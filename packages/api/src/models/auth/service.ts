import { safeParse } from 'valibot';
import * as Schema from './schema.js';
import * as Errors from '../../lib/errors.js';

export async function login(req: Schema.LoginRequest) {
  try {
    const res = await fetch('/api/login', { body: JSON.stringify(req), method: 'POST'})
      .then(r => r.json());

    const parsed = safeParse(Schema.LoginResponseSchema, res);
    if (!parsed.success) {
      return new Errors.ParseError(parsed.issues);
    }
    return parsed.output;
  } catch (error: unknown) {
    const e = new Errors.UnknownError(error as Error);
    console.dir(e);
    return e;
  }
}

export async function logout(req: Schema.LogoutRequest) {
  try {
    const res = await fetch('/api/logout', { body: JSON.stringify(req), method: 'POST'});
    if (!res.ok) {
      return new Errors.InvalidResponseError(res);
    }
    return;
  } catch (error: unknown) {
    const e = new Errors.UnknownError(error as Error);
    console.dir(e);
    return e;
  }
}
