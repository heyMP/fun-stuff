import { State } from '@heymp/signals';
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import * as AuthStore from '../store/auth.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-login')
export class MyLogin extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();
    this._init();
  }

  async _init() {
    this._watchSignal(AuthStore.store.refreshing);
  }

  async _watchSignal(signal: State<any>) {
    for await (const _ of signal) {
      this.requestUpdate();
    }
  }

  render() {
    if (AuthStore.store.refreshing.value) {
      return html`♻️`;
    }
    return html`
      <button @click=${() => AuthStore.store.login()}>Login</button>
    `;
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-login': MyLogin
  }
}
