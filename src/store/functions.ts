import * as AuthService from '../mocks/models/auth/service.js';
import * as UserService from '../mocks/models/users/service.js';

/**
 * Starts the mock service worker.
 */
export const startBrowserWorker = async () => {
  const browser = await import('../mocks/browser.js');
  return browser.worker.start();
};

// --- Authentication Functions ---
export const apiLogin = AuthService.login;
export const apiLogout = AuthService.logout;

// --- User Functions ---
export const apiGetUsers = UserService.getUsers;
export const apiCreateUser = UserService.createUser;
export const apiDeleteUser = UserService.deleteUser;
