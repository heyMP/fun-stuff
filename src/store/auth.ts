import { Signal } from '@heymp/signals';
import * as Schema from '../mocks/models/auth/schema.js';
import * as AuthService from '../services/auth.js';

type State = 
  | 'AUTHENTICATED'
  | 'UNAUTHENTICATED'
  | 'INITIALIZING';

class AuthStore {
  constructor() { }

  user = new Signal.State<Schema.AuthResponse | undefined | false>(undefined);

  refreshing = new Signal.State(false);

  state = new Signal.Computed(() => this._computeState(), [this.user]);

  private _computeState(): State {
    if (!!this.user.value) {
      return 'AUTHENTICATED';
    }
    if (this.user.value === false) {
      return 'UNAUTHENTICATED';
    }
    return 'INITIALIZING';
  }

  error = new Signal.State<Error | undefined>(undefined);

  init() {
    this.login();
  }

  async login() {
    if (this.state.value !== 'INITIALIZING') {
      this.refreshing.value = true;
    }
    const req: Schema.AuthRequest = {
      email: 'example@example.com'
    }
    const res = await AuthService.login(req);
    if (res instanceof Error) {
      return res;
    }
    this.user.value = res;
    this.refreshing.value = false;
  }

  async logout() {
    this.user.value = false;
  }
}

export const store = new AuthStore();

store.user.addEventListener('updated', () => {
  console.log('store user: ', store.user.value);
})
store.state.addEventListener('updated', () => {
  console.log('store state: ', store.state.value);
})
