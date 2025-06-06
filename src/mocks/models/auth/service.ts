import { safeParse } from 'valibot';
import * as Schema from './schema.js';

export async function login(req: Schema.LoginRequest): Promise<Schema.LoginResponse | Error> {
  try {
    const res = await fetch('/api/login', { body: JSON.stringify(req), method: 'POST'})
      .then(r => r.json());

    const parsed = safeParse(Schema.LoginResponseSchema, res);
    if (!parsed.success) {
      const e = new Error('failed to parse');
      e.cause = parsed.issues;
      throw e;
    }
    return parsed.output;
  } catch (e: unknown) {
    if (e instanceof Error) {
      e.message = `[AuthService login] ${e.message}`;
    }
    console.dir(e);
    return e as Error;
  }
}

export async function logout(req: Schema.LogoutRequest): Promise<Schema.LogoutResponse | Error> {
  try {
    const res = await fetch('/api/logout', { body: JSON.stringify(req), method: 'POST'});
    if (!res.ok) {
      const e = new Error(`status not ok ${res.status}`);
      throw e;
    }
    return;
  } catch (e: unknown) {
    if (e instanceof Error) {
      e.message = `[AuthService login] ${e.message}`;
    }
    console.dir(e);
    return e as Error;
  }
}
