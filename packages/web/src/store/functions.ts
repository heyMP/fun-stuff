import * as AuthService from 'api/models/auth';
import * as UserService from 'api/models/users';

/**
 * Starts the mock service worker.
 */
export const startBrowserWorker = async () => {
  const browser = await import('api');
  return browser.worker.start();
};

// --- Authentication Functions ---
export const apiLogin = AuthService.login;
export const apiLogout = AuthService.logout;

// --- User Functions ---
export const apiGetUsers = UserService.getUsers;
export const apiCreateUser = UserService.createUser;
export const apiDeleteUser = UserService.deleteUser;