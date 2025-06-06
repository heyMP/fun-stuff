import { type State } from '@heymp/signals';
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import * as AppStore from '../store/app.js';
import * as UsersStore from '../store/users.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-dashboard')
export class MyDashboard extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();
    this._init();
  }

  async _init() {
    this._watchSignal(UsersStore.store.users);
  }

  async _watchSignal(signal: State<any>) {
    for await (const _ of signal) {
      this.requestUpdate();
    }
  }

  render() {
    return html`
      Users: ${UsersStore.store.users.value?.length}
      <button id="create" @click=${this._handleUsersCreate}>Create</button>
      <ul>
        ${UsersStore.store.users.value?.map(user => this.renderUser(user))}
      </ul>
    `;
  }

  renderUser(user: UsersStore.User) {
    return html`<li>${user.name} <button @click=${() => this._handleUserSelect(user)}>➡️</button> <button @click=${() => this._handleUsersDelete(user)}>❌</button></li>`
  }

  async _handleUserSelect(user: UsersStore.User) {
    AppStore.store.selectUser(user);
  }

  async _handleUsersCreate() {
    const error = await UsersStore.store.create();
    if (error) {
      console.log('oh snap', error.cause);
    }
  }

  async _handleUsersDelete(user: UsersStore.User) {
    UsersStore.store.delete(user);
  }

  async _handleUsersSync() {
    const error = await UsersStore.store.sync();
    if (error) {
      console.log('oh snap', error.cause);
    }
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-dashboard': MyDashboard
  }
}
