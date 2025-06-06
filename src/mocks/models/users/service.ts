import { safeParse } from 'valibot';
import * as Schema from './schema.js';

export async function createUser(req: Schema.CreateUserRequest): Promise<Schema.CreateUserResponse | Error> {
  try {
    const res = await fetch('api/users/create', { method: 'POST', body: JSON.stringify(req)}).then(r => r.json());
    const parsed = safeParse(Schema.CreateUserResponseSchema, res);
    if (parsed.success) {
      return parsed.output;
    }
    const e = new Error('failed to parse');
    e.cause = parsed.issues;
    throw e;
  } catch (e: unknown) {
    if (e instanceof Error) {
      e.message = `[UserService createUser] ${e.message}`
    }
    console.dir(e);
    return e as Error;
  }
}

export async function getUsers(): Promise<Schema.GetUsersResponse | Error> {
  try {
    const res = await fetch('api/users').then(r => r.json());
    const parsed = safeParse(Schema.GetUsersResponseSchema, res);
    if (parsed.success) {
      return parsed.output;
    }
    const e = new Error('failed to parse');
    e.cause = parsed.issues;
    throw e;
  } catch (e: unknown) {
    if (e instanceof Error) {
      e.message = `[UserService getUsers] ${e.message}`;
    }
    console.dir(e);
    return e as Error;
  }
}

export async function deleteUser(req: Schema.DeleteUserRequest): Promise<Schema.DeleteUserResponse | Error> {
  try {
    const res = await fetch(`api/users/${req.id}`, { method: 'DELETE' });
    if (res.ok) {
      return
    }
    throw new Error('failed to delete');
  } catch (e: unknown) {
    if (e instanceof Error) {
      e.message = `[UserService deleteUser] ${e.message}`
    }
    console.dir(e);
    return e as Error;
  }
}
