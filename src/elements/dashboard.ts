import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';

// --- New Store Imports ---
import { state } from '../store/state.js';
import { createUser, deleteUser, selectUser } from '../store/actions.js';
import type { User } from '../store/types.js';

@customElement('my-dashboard')
export class MyDashboard extends SignalWatcher(LitElement) {
  render() {
    return html`
      <div class="dashboard-header">
        <h2>Users: ${state.users.value?.length ?? 0}</h2>
        <button id="create" @click=${() => createUser()}>Create User</button>
      </div>
      <ul>
        ${state.users.value?.map(user => this.renderUser(user))}
      </ul>
    `;
  }

  private renderUser(user: User) {
    return html`
      <li>
        <span>${user.name}</span>
        <div class="user-actions">
          <button @click=${() => selectUser(user)}>View Details ➡️</button>
          <button @click=${() => deleteUser(user)} class="delete-btn">❌</button>
        </div>
      </li>
    `;
  }

  static styles = css`
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-dashboard': MyDashboard;
  }
}
