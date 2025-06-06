import { safeParse } from 'valibot';
import * as Schema from '../mocks/models/users/schema.js';

export async function getUsers(): Promise<Schema.Users | Error> {
  try {
    const res = await fetch('api/users').then(r => r.json());
    const parsed = safeParse(Schema.UsersSchema, res);
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

export async function createUser(): Promise<Schema.User | Error> {
  try {
    const res = await fetch('api/users/create').then(r => r.json());
    const parsed = safeParse(Schema.UserSchema, res);
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

export async function deleteUser(user: Schema.User): Promise<true | Error> {
  try {
    const res = await fetch(`api/users/${user.id}`, { method: 'DELETE' });
    if (res.ok) {
      return true;
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
