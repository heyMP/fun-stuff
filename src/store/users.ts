import { Signal } from '@heymp/signals';
import * as Schema from '../mocks/models/users/schema.js';
import * as UserService from '../services/users.js';

export type User = Schema.User;

export class UsersStore {
  /**
   * Store for managing user data in the application.
   * Handles synchronization with the API, user creation, and maintains the current state
   * of users using a reactive signal.
   * 
   * @property users - A reactive signal containing the current list of users or undefined if not yet loaded
   */
  constructor() { }

  users = new Signal.State<Schema.Users | undefined>(undefined);

  private pendingSync: Promise<void | Error> | null = null;

  /**
   * Synchronizes the users data from the API.
   * Fetches users from the API endpoint and updates the store's state.
   * @returns Promise that resolves to void on success or Error on failure
   */
  async sync(): Promise<void | Error> {
    const res = await UserService.getUsers();
    if (res instanceof Error) {
      return res;
    }
    this.users.value = res;
  }

  /**
   * Performs a batched synchronization of users data.
   * If a sync is already in progress, returns the existing promise instead of starting a new sync.
   * This prevents multiple simultaneous sync operations.
   * @returns Promise that resolves to void on success or Error on failure
   */
  async batchedSync(): Promise<void | Error> {
    if (!this.pendingSync) {
      this.pendingSync = this.sync().finally(() => {
        this.pendingSync = null;
      });
    }
    return this.pendingSync;
  }

  /**
   * Creates a new user via the API.
   * Fetches the created user data and adds it to the store's state.
   * @returns Promise that resolves to void on success or Error on failure
   */
  async create(): Promise<void | Error> {
    const res = await UserService.createUser();
    if (res instanceof Error) {
      return res;
    }
    this.users.value = [...this.users?.value ?? [], res];
  }
}

export const usersStore = new UsersStore();
