import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';

// --- New Store Imports ---
import { state } from '../store/state.js';
import { login } from '../store/actions.js';

@customElement('my-login')
export class MyLogin extends SignalWatcher(LitElement) {
  render() {
    console.log(state.status.value)
    // Show a loading indicator when the app is in an authenticating state.
    if (state.status.value === 'AUTHENTICATING') {
      return html`<div>Authenticating... ♻️</div>`;
    }

    return html`
      ${state.status.value === 'ERROR' ? html`${state.error.value?.error.message}` : ''} 
      <button @click=${() => login('example@example.com')}>Login</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-login': MyLogin;
  }
}
