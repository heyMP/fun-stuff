import * as AuthService from 'api/models/auth';
import * as UserService from 'api/models/users';
import { registerFunctions } from './utils/createStatefulAction.js';
import type { InferFunctionError } from './utils/createStatefulAction.js';

/**
 * Starts the mock service worker.
 */
export const startBrowserWorker = async () => {
  const browser = await import('api');
  return browser.worker.start();
};

/**
 * Define our functions - the library will automatically infer all error types!
 */
const functions = {
  apiLogin: AuthService.login,
  apiLogout: AuthService.logout,
  apiGetUsers: UserService.getUsers,
  apiCreateUser: UserService.createUser,
  apiDeleteUser: UserService.deleteUser,
  startBrowserWorker: startBrowserWorker,
} as const;

// Register with the library
export const functionRegistry = registerFunctions(functions);

/**
 * The library automatically infers the perfect discriminated union from our functions!
 */
export type FunctionError = InferFunctionError<typeof functions>;
