import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';

// --- New Store Imports ---
import { state } from '../store/state.js';

@customElement('my-initialize')
export class MyInitialize extends SignalWatcher(LitElement) {
  render() {
    return html`
      <div class="container">
        <h2>Loading Application...</h2>
        <p>Status: ${state.status.value}</p>
        <div class="spinner"></div>
      </div>
    `;
  }

  static styles = css`
    .container { text-align: center; padding: 2rem; }
    .spinner { /* Add your loading spinner styles here */ }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-initialize': MyInitialize;
  }
}
