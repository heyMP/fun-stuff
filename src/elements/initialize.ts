import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js';
import * as AuthStore from '../store/auth.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-initialize')
export class MyInitialize extends LitElement {
  render() {
    return html`
      <div>App State: ${AppStore.store.state.value}</div>
    `;
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-initialize': MyInitialize
  }
}
