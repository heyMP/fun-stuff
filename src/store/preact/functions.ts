import * as AuthService from '../../services/auth.js';
import * as UserService from '../../mocks/models/users/service.js';
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
export const apiGetUsers = UserService.getUsers;
export const apiCreateUser = UserService.createUser;
export const apiDeleteUser = UserService.deleteUser;
