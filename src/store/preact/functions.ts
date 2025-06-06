import * as UserService from '../../services/users.js';
import * as AuthService from '../../services/auth.js';
import * as Schema from '../../mocks/models/users/schema.js';
import type { AuthRequest } from './types.js';

/**
 * Starts the mock service worker.
 */
export const startBrowserWorker = async () => {
  const browser = await import('../../mocks/browser.js');
  return browser.worker.start();
};

// --- Authentication Functions ---
export const apiLogin = (req: AuthRequest) => AuthService.login(req);

// --- User Functions ---
export const apiGetUsers = () => UserService.getUsers();
export const apiCreateUser = () => UserService.createUser();
export const apiDeleteUser = (user: Schema.User) => UserService.deleteUser(user);