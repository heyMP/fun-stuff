import { type State } from '@heymp/signals';
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { worker } from './mocks/browser.js';
import * as AuthStore from './store/auth.js';
import * as UsersStore from './store/users.js';
import './my-element-child.js';

const authStore = AuthStore.authStore;
const usersStore = UsersStore.usersStore;

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {
  @state() trigger?: HTMLElement;

  @state() toggle = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._init();
  }

  async _init() {
    await worker.start();
    this._watchSignal(usersStore.users);
    this._watchSignal(authStore.updated);
    usersStore.batchedSync();
    authStore.init();
  }

  async _watchSignal(signal: State<any>) {
    for await (const _ of signal) {
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <div>${authStore.state.value} ${!!authStore.user?.value ? authStore.user.value.name : ''}</div>
      <ul>
        ${usersStore.users.value?.map(user => this.renderUser(user))}
      </ul>
      ${this.toggle
        ? html`<button id="create" @click=${this._handleUsersCreate} ${ref(this._registerTrigger)}>Create</button>`
        : html`<button id="sync" @click=${this._handleUsersSync} ${ref(this._registerTrigger)}>Sync</button>`
      }
      <button @click=${() => this.toggle = !this.toggle}>Toggle</button>
      <my-element-child
        .trigger=${this.trigger}
      ></my-element-child>
    `;
  }

  renderUser(user: UsersStore.User) {
    return html`<li>${user.name}: ${user.email}</li>`
  }

  async _handleUsersCreate() {
    const error = await usersStore.create();
    if (error) {
      console.log('oh snap', error.cause);
    }
  }

  async _handleUsersSync() {
    const error = await usersStore.sync();
    if (error) {
      console.log('oh snap', error.cause);
    }
  }

  private _registerTrigger(element: Element | undefined) {
    this.trigger = element as HTMLElement;
  }

  static styles = css`
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
