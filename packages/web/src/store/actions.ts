import { state } from './state.js';
import { createStatefulAction, getFunction } from './utils/createStatefulAction.js';
import { functionRegistry } from './functions.js'; // Import to register functions and get types
import type { User, AuthUser } from './types';

/**
 * Initializes the application by starting the mock worker and then
 * attempting to log in.
 */
export const initializeApp = createStatefulAction({
  preStatus: 'INITIALIZING',
  action: async () => {
    const startBrowserWorker = getFunction('startBrowserWorker');
    await startBrowserWorker();
    // After initialization, immediately attempt to log in.
    await login('example@example.com');
  },
});

/**
 * Logs the user in. Wrapped to handle status and errors automatically.
 */
export const login = createStatefulAction({
  preStatus: 'AUTHENTICATING',
  postStatus: 'FETCHING_USERS', // On success, we know the next step is fetching users.
  action: async (email: AuthUser['email']) => {
    const apiLogin = getFunction('apiLogin');
    const res = await apiLogin({ email });
    state.authUser.value = res;
  },
});

/**
 * Logs the user in. Wrapped to handle status and errors automatically.
 */
export const logout = createStatefulAction({
  postStatus: 'LOGIN', // On success, we know the next step is fetching users.
  action: async (email: AuthUser['email']) => {
    const apiLogout = getFunction('apiLogout');
    await apiLogout({ email });
    state.authUser.value = null;
  },
});

/**
 * Fetches the list of users from the API.
 */
export const syncUsers = createStatefulAction({
  preStatus: 'FETCHING_USERS',
  postStatus: 'READY', // This is the final step for a successful load.
  action: async () => {
    const apiGetUsers = getFunction('apiGetUsers');
    const res = await apiGetUsers();
    state.users.value = res;
  },
});

/**
 * Creates a new user. This is a simpler action that doesn't affect the main
 * app status but updates the user list on success.
 */
export const createUser = async () => {
  try {
    const apiCreateUser = getFunction('apiCreateUser');
    const res = await apiCreateUser({ email: 'example@example.com' });
    state.users.value = [...(state.users.value ?? []), res];
  } catch (err) {
    if (err && typeof err === 'object' && 'functionId' in err && 'error' in err) {
      const enhancedError = err as { functionId: keyof typeof functionRegistry; error: Error };
      state.error.value = { id: enhancedError.functionId, error: enhancedError.error } as any;
    }
  }
};

/**
 * Deletes a user.
 */
export const deleteUser = async (user: User) => {
  try {
    const apiDeleteUser = getFunction('apiDeleteUser');
    await apiDeleteUser(user);
    state.users.value = state.users.value?.filter((u) => u.id !== user.id);
    state.selectedUser.value = null; // Clear selection after deletion.
  } catch (err) {
    if (err && typeof err === 'object' && 'functionId' in err && 'error' in err) {
      const enhancedError = err as { functionId: keyof typeof functionRegistry; error: Error };
      state.error.value = { id: enhancedError.functionId, error: enhancedError.error } as any;
    }
  }
};

// --- Synchronous Actions ---

/**
 * Sets the currently selected user.
 */
export const selectUser = (user: User) => {
  state.selectedUser.value = user;
};
