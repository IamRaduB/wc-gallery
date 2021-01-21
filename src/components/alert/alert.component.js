import style from './alert.styles.scss';
import template from './alert.template.html';

const galleryAlertTemplate = document.createElement('template');
galleryAlertTemplate.innerHTML = template;

export class AlertComponent extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'message', 'dismissable'];
  }

  constructor() {
    super();
    this._action = null;

    this.build();
  }

  build() {
    this.attachShadow({ mode: 'open' });
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(galleryAlertTemplate.content.cloneNode(true));
  }

  attributeChangedCallback(attrName) {
    switch (attrName) {
      case 'type':
        this.setAlertType();
        break;
      case 'message':
        this.shadowRoot.querySelector('.alert-message').innerText = this.getAttribute('message');
        break;
      case 'dismissable':
        this.shadowRoot.querySelector('.alert-dismiss').hidden = !this.hasAttribute('dismissable');
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.alert-dismiss').addEventListener('click', this.dismiss.bind(this));
    this.shadowRoot.querySelector('.alert-action').addEventListener('click', () => {
      if (this._action && typeof this._action.execute === 'function') {
        this._action.execute();
        this.dismiss();
      }
    });
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('.alert-dismiss').removeEventListener('click', this.dismiss.bind(this));
  }

  setAlertType() {
    const alert = this.shadowRoot.querySelector('.alert');
    switch (this.getAttribute('type')) {
      case 'success':
        alert.classList.add('alert--success');
        break;
      case 'error':
        alert.classList.add('alert--error');
        break;
      case 'loading':
        alert.classList.add('alert--loading');
        break;
      default:
        break;
    }
  }

  dismiss() {
    this.remove();
  }

  /**
   * @param { { execute: function, label: string } | null } payload
   */
  set action(payload) {
    this._action = payload;
    this.shadowRoot.querySelector('.alert-action').textContent = payload.label;
  }

  get action() {
    return this._action;
  }
}

customElements.define('gallery-alert', AlertComponent);
