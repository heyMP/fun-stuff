import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';

// --- New Store Imports ---
// Import specific items from our new, organized store files.
import { state } from './store/state.js';
import { view } from './store/computed.js';
import { initializeApp, logout } from './store/actions.js';
import './store/effects.js'; // Import once to activate the reactive effects.

// Import the elements needed for each view.
import './elements/initialize.js';
import './elements/dashboard.js';
import './elements/user.js';
import './elements/login.js';

/**
 * An example element that is automatically reactive to the store's signals.
 */
@customElement('my-element')
export class MyElement extends SignalWatcher(LitElement) { // <-- Use the SignalWatcher mixin
  private static isInitialized = false;

  connectedCallback(): void {
    super.connectedCallback();
    // Ensure the main app initialization action is called only once.
    if (!MyElement.isInitialized) {
      initializeApp();
      MyElement.isInitialized = true;
    }
  }

  // A map to associate view states with their corresponding templates.
  private viewMap = {
    LOADING: html`<my-initialize></my-initialize>`,
    DASHBOARD: html`<my-dashboard></my-dashboard>`,
    USER_DETAIL: html`<my-user></my-user>`,
    LOGIN: html`<my-login></my-login>`,
  };

  render() {
    // Render the navigation and the current view based on the computed signal.
    return html`
      ${this.renderNav()}
      <main>
        ${this.viewMap[view.value] || ''}
      </main>
    `;
  }

  renderNav() {
    // Read directly from our unified state object.
    const user = state.authUser.value;
    if (user) {
      return html`
        <nav>
          <span>${user.name}</span>
          <button @click=${() => logout(user.email)}>Logout</button>
        </nav>
      `;
    }
    return '';
  }

  static styles = css`
    :host {
      margin: auto;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
