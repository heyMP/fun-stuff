import { type State } from '@heymp/signals';
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import * as UsersStore from '../store/users.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-user')
export class MyUser extends LitElement {
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
    const user = UsersStore.store.selectedUser.value;
    return html`
      ${user?.name}
      <button @click=${() => UsersStore.store.selectedUser.value = undefined}>Back</button>
      ${user ? html`
        <button @click=${() => UsersStore.store.delete(user)}>Delete</button>
      `: ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-user': MyUser
  }
}
