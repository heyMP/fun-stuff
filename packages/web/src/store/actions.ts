import { state } from './state.js';
import { createStatefulAction } from './utils/createStatefulAction.js';
import * as functions from './functions';
import type { User, AuthUser } from './types';

/**
 * Initializes the application by starting the mock worker and then
 * attempting to log in.
 */
export const initializeApp = createStatefulAction({
  preStatus: 'INITIALIZING',
  action: async () => {
    await functions.startBrowserWorker();
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
    const res = await functions.apiLogin({ email });
    if (res instanceof Error) throw res;
    state.authUser.value = res;
  },
});

/**
 * Logs the user in. Wrapped to handle status and errors automatically.
 */
export const logout = createStatefulAction({
  postStatus: 'ERROR', // On success, we know the next step is fetching users.
  action: async (email: AuthUser['email']) => {
    const res = await functions.apiLogout({ email });
    if (res instanceof Error) throw res;
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
    const res = await functions.apiGetUsers();
    if (res instanceof Error) throw res;
    state.users.value = res;
  },
});

/**
 * Creates a new user. This is a simpler action that doesn't affect the main
 * app status but updates the user list on success.
 */
export const createUser = async () => {
  const res = await functions.apiCreateUser({ email: 'example@example.com' });
  if (res instanceof Error) {
    state.error.value = res;
    return;
  }
  state.users.value = [...(state.users.value ?? []), res];
};

/**
 * Deletes a user.
 */
export const deleteUser = async (user: User) => {
  const res = await functions.apiDeleteUser(user);
  if (res instanceof Error) {
    state.error.value = res;
    return;
  }
  state.users.value = state.users.value?.filter((u) => u.id !== user.id);
  state.selectedUser.value = null; // Clear selection after deletion.
};

// --- Synchronous Actions ---

/**
 * Sets the currently selected user.
 */
export const selectUser = (user: User) => {
  state.selectedUser.value = user;
};
