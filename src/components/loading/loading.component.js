import style from './loading.styles.scss';
import template from './loading.template.html';

const galleryLoadingTemplate = document.createElement('template');
galleryLoadingTemplate.innerHTML = template;

/**
 * Attributes { hidden: boolean }
 * Output Events [ "photo:selected<id>" ]
 */
class LoadingComponent extends HTMLElement {
  constructor() {
    super();
    this.build();
  }

  static get observedAttributes() {
    return ['hidden'];
  }

  build() {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(galleryLoadingTemplate.content.cloneNode(true));
  }
}

customElements.define('gallery-loading', LoadingComponent);
