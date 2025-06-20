import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';

// --- New Store Imports ---
import { state } from '../store/state.js';
import * as Actions from '../store/actions.js';
import type { User } from '../store/types.js';

@customElement('my-dashboard')
export class MyDashboard extends SignalWatcher(LitElement) {
  render() {
    return html`
      <div class="dashboard-header">
        <h2>Users: ${state.users.value?.length ?? 0}</h2>
        <button id="create" @click=${() => Actions.createUser()}>Create User</button>
        ${this.renderCreateUserError()}
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
          <button @click=${() => Actions.selectUser(user)}>View Details ➡️</button>
          <button @click=${() => Actions.deleteUser(user)} class="delete-btn">❌</button>
        </div>
      </li>
    `;
  }

  private renderCreateUserError() {
    const error = state.error.value;
    if (!error) return html``;
    if (error.id === 'apiCreateUser') {
      return html`<div class="error">Error creating user: ${error.error.message}</div>`;
    }
    return html``;
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
    .error {
      background-color: #fee;
      color: #c33;
      padding: 0.5rem;
      border-radius: 4px;
      margin: 0.5rem 0;
      border: 1px solid #fcc;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-dashboard': MyDashboard;
  }
}
