import * as Auth from './models/auth/handlers.js';
import * as Users from './models/users/handlers.js';

// Describe the network.
export const handlers = [
  ...Auth.handlers,
  ...Users.handlers,
]
