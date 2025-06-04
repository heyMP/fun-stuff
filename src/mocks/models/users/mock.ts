import { Valimock } from "valimock";
import { UserSchema } from './schema.js';

export function createUser() {
  return new Valimock().mock(UserSchema);
}

export function createUsers() {
  return Array(10).fill(undefined).map(() => createUser())
}
