import { Signal } from '@heymp/signals';
import { safeParse } from 'valibot';
import * as Schema from '../mocks/models/users/schema.js';

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
    try {
      const res = await fetch('api/users').then(r => r.json());
      const parsed = safeParse(Schema.UsersSchema, res);
      if (parsed.success) {
        this.users.value = parsed.output;
      }
      const e = new Error('failed to parse');
      e.cause = parsed.issues;
      throw e;
    } catch (e: unknown) {
      if (e instanceof Error) {
        e.message = `[UsersStore sync] ${e.message}`
      }
      return e as Error;
    }
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
    try {
      const res = await fetch('api/users/create').then(r => r.json());
      const parsed = safeParse(Schema.UserSchema, res);
      if (parsed.success) {
        this.users.value = [...this.users.value ?? [], parsed.output];
      }
      const e = new Error('failed to parse');
      e.cause = parsed.issues;
      throw e;
    } catch (e: unknown) {
      if (e instanceof Error) {
        e.message = `[UsersStore create] ${e.message}`
      }
      console.dir('hi', e)
      return e as Error;
    }
  }
}

export const usersStore = new UsersStore();
