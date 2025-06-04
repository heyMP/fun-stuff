import { Signal } from '@heymp/signals';
import { safeParse } from 'valibot';
import * as Schema from '../mocks/models/auth/schema.js';

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
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(req),
    })
      .then(r => r.json());

    const user = safeParse(Schema.AuthResponseSchema, res);
    if (!user.success) {
      const e = new Error('failed to login');
      e.cause = user.issues;
      this.error.value = e;
      this.user.value = false;
      return e;
    }

    this.user.value = user.output;
    this._timedRefresh();
  }

  async _timedRefresh() {
    console.log('timedrefresh')
    await new Promise(res => setTimeout(res, 5000));
    this.refreshing.value = true;
    await this.login();
    this.refreshing.value = false;
  }
}

export const authStore = new AuthStore();
