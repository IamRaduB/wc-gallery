import template from './viewer.template.html';
import style from './viewer.styles.scss';
import placeholderImage from '../../styles/assets/placeholder-image.png';
import { Swipe } from '../../lib/swipe';

const galleryViewerTemplate = document.createElement('template');
galleryViewerTemplate.innerHTML = template;

class ViewerComponent extends HTMLElement {
  constructor() {
    super();

    this._photo = null;

    this.build();
  }

  build() {
    this.attachShadow({ mode: 'open' });
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(galleryViewerTemplate.content.cloneNode(true));

    const main = this.shadowRoot.querySelector('.viewer-img');
    const mainImg = document.createElement('img');
    mainImg.src = placeholderImage;
    main.prepend(mainImg);
  }

  connectedCallback() {
    const leftChevron = this.shadowRoot.querySelector('.viewer-action--left');
    leftChevron.addEventListener('click', () => {
      this.previous();
    });

    const rightChevron = this.shadowRoot.querySelector('.viewer-action--right');
    rightChevron.addEventListener('click', () => {
      this.next();
    });

    const viewer = this.shadowRoot.querySelector('.viewer-main');
    const swipe = new Swipe(viewer);
    swipe.onSwipeLeft = this.previous.bind(this);
    swipe.onSwipeRight = this.next.bind(this);
  }

  updateImage() {
    const imgEl = this.shadowRoot.querySelector('.viewer-main img');
    const titleEl = this.shadowRoot.querySelector('.viewer-mainTitleContent');
    imgEl.src = this.photo.large;
    titleEl.textContent = this.photo.title;
  }

  next() {
    this.dispatchEvent(
      new CustomEvent('view:next', {
        bubbles: true,
      })
    );
  }

  previous() {
    this.dispatchEvent(
      new CustomEvent('view:previous', {
        bubbles: true,
      })
    );
  }

  get photo() {
    return this._photo;
  }

  set photo(value) {
    this._photo = value;
    this.updateImage();
  }
}

customElements.define('gallery-viewer', ViewerComponent);
