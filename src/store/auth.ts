import { Signal } from '@heymp/signals';
import { safeParse } from 'valibot';
import * as Schema from '../mocks/models/auth/schema.js';
import * as AuthService from '../services/auth.js';

/**
 * Ordinal Enum / Ordinal Mapping
 *
 * Allows us to have sort order of an enum.
 */
export const STATES = {
  INITIALIZING: 0,
  UNAUTHENTICATED: 1,
  AUTHENTICATED: 2,
  REFRESHING: 3,
} as const;

type State = keyof typeof STATES;

class AuthStore {
  constructor() { }

  user = new Signal.State<Schema.AuthResponse | undefined | false>(undefined);

  refreshing = new Signal.State(false);

  state = new Signal.Computed(() => {
    if (this.refreshing.value === true) {
      return 'REFRESHING' as State;
    }
    if (!!this.user.value) {
      return 'AUTHENTICATED' as State;
    }
    if (this.user.value === false) {
      return 'UNAUTHENTICATED' as State;
    }
    return 'INITIALIZING' as State;
  }, [this.user, this.refreshing]);

  error = new Signal.State<Error | undefined>(undefined);

  updated = new Signal.Computed(() => new Date(), [this.user, this.refreshing, this.state, this.error]);

  init() {
    this.login();
  }

  async login() {
    const req: Schema.AuthRequest = {
      email: 'example@example.com'
    }
    const res = await AuthService.login(req);
    if (res instanceof Error) {
      return res;
    }
    this.user.value = res;

    this._timedRefresh();
  }

  async _timedRefresh() {
    await new Promise(res => setTimeout(res, 5000));
    this.refreshing.value = true;
    await this.login();
    this.refreshing.value = false;
  }
}

export const authStore = new AuthStore();
