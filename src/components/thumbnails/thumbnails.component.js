import template from './thumbnails.template.html';
import style from './thumbnails.styles.scss';
import { clearContainer } from '../../lib/dom-utils';

const galleryThumbnailsTemplate = document.createElement('template');
galleryThumbnailsTemplate.innerHTML = template;

class ThumbnailsComponent extends HTMLElement {
  constructor() {
    super();
    this._photos = [];
    this._activePhoto = null;
    this.build();
  }

  static get observedAttributes() {
    return ['photos', 'activePhoto'];
  }

  build() {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(galleryThumbnailsTemplate.content.cloneNode(true));
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const thumbEl = this.shadowRoot.querySelector('.thumbnails');
    clearContainer(thumbEl);
    const list = this.photos.map((photo) => {
      const photoEl = document.createElement('gallery-photo');
      photoEl.setAttribute('id', `photo_${photo.id}`);
      photoEl.setAttribute('image', photo.thumbnail);
      if (this.activePhoto && photo.id === this.activePhoto.id) {
        photoEl.setAttribute('active', '');
      }
      return photoEl;
    });
    thumbEl.append(...list);
  }

  /**
   *
   * @returns {Photo[]}
   */
  get photos() {
    return this._photos;
  }

  set photos(photos) {
    this._photos = photos;
    this.render();
  }

  get activePhoto() {
    return this._activePhoto;
  }

  set activePhoto(value) {
    this._activePhoto = value;
    this.shadowRoot.querySelectorAll('gallery-photo').forEach((node) => {
      if (node.getAttribute('id') === `photo_${this._activePhoto.id}`) {
        node.setAttribute('active', '');
        node.scrollIntoView({
          block: 'center',
          inline: 'nearest',
          behavior: 'smooth',
        });
      } else {
        node.removeAttribute('active');
      }
    });
  }
}

customElements.define('gallery-thumbnails', ThumbnailsComponent);
