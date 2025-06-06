import { type State } from '@heymp/signals';
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import * as AppStore from './store/app.js';
import * as AuthStore from './store/auth.js';
import * as UsersStore from './store/users.js';
import './elements/dashboard.js';
import './elements/user.js';

const appStore = AppStore.store;
const authStore = AuthStore.store;
const usersStore = UsersStore.store;

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();
    this._init();
  }

  async _init() {
    appStore.initialize();
    this._watchSignal(appStore.state);
    this._watchSignal(usersStore.users);
    this._watchSignal(authStore.updated);
  }

  async _watchSignal(signal: State<any>) {
    for await (const _ of signal) {
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <div>App State: ${appStore.state.value}</div>
      <div>${authStore.state.value} ${!!authStore.user?.value ? authStore.user.value.name : ''}</div>
      ${appStore.state.value === 'dashboard' ? html`<my-dashboard></my-dashboard>` : ''}
      ${appStore.state.value === 'user' ? html`<my-user></my-user>` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
