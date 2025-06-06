import { Signal } from '@heymp/signals';
import * as UsersStore from './users.js';
import * as InitStore from './init.js';

type State =
  | 'initializing'
  | 'dashboard'
  | 'login'
  | 'user';

class AppStore {
  state = new Signal.Computed(() => this._computeState(), [InitStore.store.state, UsersStore.store.selectedUser]);

  public async initialize() {
    await InitStore.store.initialize();
  }

  public selectUser(user: UsersStore.User) {
    UsersStore.store.selectedUser.value = user;
  }

  private _computeState(): State {
    if (InitStore.store.state.value === 'initializing') {
      return 'initializing';
    }
    if (InitStore.store.state.value === 'error') {
      return 'login';
    }
    if (InitStore.store.state.value === 'complete') {
      if (UsersStore.store.selectedUser.value) {
        return 'user';
      }
      return 'dashboard';
    }
    return 'initializing';
  }
}

export const store = new AppStore();

