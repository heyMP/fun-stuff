import { Valimock } from "valimock";
import * as Schema from './schema.js';

export function createUser(req?: Schema.CreateUserRequest) {
  const user = new Valimock().mock(Schema.UserSchema);
  if (req) {
    user.email = req.email;
  }
  return user;
}

export function createUsers() {
  return Array(10).fill(undefined).map(() => createUser())
}
