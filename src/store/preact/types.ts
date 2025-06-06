import * as Schema from '../../mocks/models/users/schema.js';
import * as AuthSchema from '../../mocks/models/auth/schema.js';

// Re-exporting schema types for use in the application.
export type User = Schema.User;
export type Users = Schema.Users;
export type AuthUser = AuthSchema.AuthUser;

/**
 * Represents the overall status of the application, combining initialization,
 * authentication, and data loading states into a single, explicit state machine.
 */
export type Status =
  | 'INITIALIZING'      // The application is starting, worker is loading.
  | 'PENDING_AUTH'      // Waiting for the initial login attempt.
  | 'AUTHENTICATING'    // The login API call is in progress.
  | 'FETCHING_USERS'    // Login succeeded, now fetching user data.
  | 'READY'             // All data is loaded and the app is interactive.
  | 'ERROR';            // A critical error occurred.

/**
 * Represents the final computed view state, used to determine which
 * UI or page to display to the user.
 */
export type View =
  | 'LOADING'
  | 'LOGIN'
  | 'DASHBOARD'
  | 'USER_DETAIL';