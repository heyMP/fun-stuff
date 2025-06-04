import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element-child')
export class MyElement extends LitElement {
  @state() trigger?: HTMLElement;

  render() {
    return html`
      ${this.trigger?.id}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element-child': MyElement
  }
}
