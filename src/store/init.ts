import { Signal } from '@heymp/signals';
import * as AuthStore from './auth.js';
import * as UsersStore from './users.js';

export type State =
  | 'initializing'
  | 'complete'
  | 'error';

class InitStore {
  constructor() {}

  public state = new Signal.Computed(() => this._computeState(), [AuthStore.store.state, UsersStore.store.state]);

  public async initialize() {
    const browser = await import('../mocks/browser.js');
    await browser.worker.start();
    AuthStore.store.init();
    for await (const authState of AuthStore.store.state) {
      if (authState === 'AUTHENTICATED' && this.state.value === 'initializing') {
        await UsersStore.store.sync();
      }
    }
  }

  private _computeState(): State {
    if (AuthStore.store.state.value) {
      if (UsersStore.store.state.value === 'complete') {
        return 'complete';
      }
      if (UsersStore.store.state.value === 'error') {
        return 'error';
      }
      return 'initializing';
    }
    if (AuthStore.store.state.value === 'UNAUTHENTICATE') {
      return 'error';
    }
    return 'initializing';
  }
}

export const store = new InitStore(); 
