import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';

// --- New Store Imports ---
import { state } from '../store/preact/state.js';
import { deleteUser } from '../store/preact/actions.js';

@customElement('my-user')
export class MyUser extends SignalWatcher(LitElement) {
  render() {
    const user = state.selectedUser.value;

    // If no user is selected, render nothing.
    if (!user) {
      return html``;
    }

    return html`
      <div class="user-header">
        <h2>${user.name}</h2>
        <div>
          <button @click=${() => (state.selectedUser.value = null)}>Back to Dashboard ⬅️</button>
          <button @click=${() => deleteUser(user)} class="delete-btn">Delete User ❌</button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-user': MyUser;
  }
}