import { type State } from '@heymp/signals';
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import * as AppStore from './store/app.js';
import * as AuthStore from './store/auth.js';
import * as UsersStore from './store/users.js';
import './elements/initialize.js';
import './elements/dashboard.js';
import './elements/user.js';
import './elements/login.js';

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
    AppStore.store.initialize();
    this._watchSignal(AppStore.store.state);
    this._watchSignal(AuthStore.store.state);
    this._watchSignal(UsersStore.store.users);
  }

  async _watchSignal(signal: State<any>) {
    for await (const _ of signal) {
      this.requestUpdate();
    }
  }

  render() {
    return html`
      ${this.renderNav()}
      ${AppStore.store.state.value === 'initializing' ? html`<my-initialize></my-initialize>` : ''}
      ${AppStore.store.state.value === 'dashboard' ? html`<my-dashboard></my-dashboard>` : ''}
      ${AppStore.store.state.value === 'user' ? html`<my-user></my-user>` : ''}
      ${AppStore.store.state.value === 'login' ? html`<my-login></my-login>` : ''}
    `;
  }

  renderNav() {
    const user = AuthStore.store.user.value;
    if (user) {
      return html`
        <div>
          ${user ? user.name : ''}<button @click=${() => AuthStore.store.logout()}>Logout</button>
        </div> 
      `;
    }
    return '';
  }

  static styles = css`
    :host {
      margin: auto;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
