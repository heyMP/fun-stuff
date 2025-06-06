import { state } from './state.js';
import { createStatefulAction } from './utils/createStatefulAction.js';
import * as functions from './functions';
import type { User, AuthRequest } from './types';

/**
 * Initializes the application by starting the mock worker and then
 * attempting to log in.
 */
export const initializeApp = createStatefulAction({
  preStatus: 'INITIALIZING',
  action: async () => {
    await functions.startBrowserWorker();
    // After initialization, immediately attempt to log in.
    await login({ email: 'example@example.com' });
  },
});

/**
 * Logs the user in. Wrapped to handle status and errors automatically.
 */
export const login = createStatefulAction({
  preStatus: 'AUTHENTICATING',
  postStatus: 'FETCHING_USERS', // On success, we know the next step is fetching users.
  action: async (req: AuthRequest) => {
    const res = await functions.apiLogin(req);
    if (res instanceof Error) throw res;
    state.authUser.value = res;
    // The successful state change will trigger the effect to fetch users.
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
 * Logs the user out by clearing the auth user and resetting the status.
 */
export const logout = () => {
  state.authUser.value = null;
  state.status.value = 'INITIALIZING'; // Or a new 'LOGGED_OUT' state if desired.
};

/**
 * Sets the currently selected user.
 */
export const selectUser = (user: User) => {
  state.selectedUser.value = user;
};
