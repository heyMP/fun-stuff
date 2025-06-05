import { safeParse } from 'valibot';
import * as Schema from '../mocks/models/auth/schema.js';

export async function login(req: Schema.AuthRequest): Promise<Schema.AuthResponse | Error> {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(req),
    })
      .then(r => r.json());

    const parsed = safeParse(Schema.AuthResponseSchema, res);
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
