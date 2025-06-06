import { Signal } from '@heymp/signals';
import * as Schema from '../mocks/models/users/schema.js';
import * as UserService from '../services/users.js';

export type User = Schema.User;

export type State =
  | 'initializing'
  | 'complete'
  | 'error';

export class UsersStore {
  /**
   * Store for managing user data in the application.
   * Handles synchronization with the API, user creation, and maintains the current state
   * of users using a reactive signal.
   * 
   * @property users - A reactive signal containing the current list of users or undefined if not yet loaded
   */
  constructor() {}

  users = new Signal.State<Schema.Users | undefined>(undefined);

  selectedUser = new Signal.State<Schema.User | undefined>(undefined);

  error = new Signal.State<Error | undefined>(undefined);

  state = new Signal.Computed(() => this._computeState(), [this.users, this.error]);

  private _computeState(): State {
    if (this.users.value) {
      return 'complete';
    }
    if (this.error.value) {
      return 'error';
    }
    return 'initializing';
  }

  /**
   * Synchronizes the users data from the API.
   * Fetches users from the API endpoint and updates the store's state.
   * @returns Promise that resolves to void on success or Error on failure
   */
  async sync(): Promise<void | Error> {
    const res = await UserService.getUsers();
    if (res instanceof Error) {
      this.error.value = res;
      return res;
    }
    this.users.value = res;
  }

  /**
   * Creates a new user via the API.
   * Fetches the created user data and adds it to the store's state.
   * @returns Promise that resolves to void on success or Error on failure
   */
  async create(): Promise<void | Error> {
    const res = await UserService.createUser();
    if (res instanceof Error) {
      this.error.value = res;
      return res;
    }
    this.users.value = [...this.users?.value ?? [], res];
  }

  async delete(user: Schema.User): Promise<void | Error> {
    const res = await UserService.deleteUser(user);
    if (res instanceof Error) {
      this.error.value = res;
      return res;
    }
    this.users.value = this.users.value?.filter(u => u.id !== user.id);
    this.selectedUser.value = undefined;
  }
}

export const store = new UsersStore();
