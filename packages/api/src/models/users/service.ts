import { safeParse } from 'valibot';
import * as Schema from './schema.js';
import * as Errors from '../../lib/errors.js';

export async function createUser(req: Schema.CreateUserRequest) {
  try {
    const res = await fetch('api/users/create', { method: 'POST', body: JSON.stringify(req) }).then(r => r.json());
    const parsed = safeParse(Schema.CreateUserResponseSchema, res);
    if (parsed.success) {
      return parsed.output;
    }
    return new Errors.ParseError(parsed.issues);
  } catch (error: unknown) {
    const e = new Errors.UnknownError(error as Error);
    console.dir(e);
    return e;
  }
}

export async function getUsers() {
  try {
    const res = await fetch('api/users').then(r => r.json());
    const parsed = safeParse(Schema.GetUsersResponseSchema, res);
    if (parsed.success) {
      return parsed.output;
    }
    return new Errors.ParseError(parsed.issues);
  } catch (error: unknown) {
    const e = new Errors.UnknownError(error as Error);
    console.dir(e);
    return e;
  }
}

export async function deleteUser(req: Schema.DeleteUserRequest) {
  try {
    const res = await fetch(`api/users/${req.id}`, { method: 'DELETE' });
    if (!res.ok) {
      return new Errors.InvalidResponseError(res);
    }
    return
  } catch (e: unknown) {
    if (e instanceof Error) {
      e.message = `[UserService deleteUser] ${e.message}`
    }
    console.dir(e);
    return e as Error;
  }
}
