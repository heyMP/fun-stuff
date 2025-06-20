import { signal } from '@preact/signals';
import type { User, Users, AuthUser, Status } from './types';
import type { FunctionError } from './functions.js';

/**
 * A single object containing all the core, mutable state signals for the application.
 */
export const state = {
  // The single, explicit status of the application's lifecycle.
  status: signal<Status>('INITIALIZING'),

  // The authenticated user's data, or null if not logged in.
  authUser: signal<AuthUser | null>(null),

  // The list of all users.
  users: signal<Users | null | undefined>(null),

  // The currently selected user for a detail view.
  selectedUser: signal<User | null>(null),

  // A global error object with automatic type inference from registered functions.
  error: signal<FunctionError | null>(null),
};
