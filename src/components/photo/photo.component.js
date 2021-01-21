import style from './photo.styles.scss';
import template from './photo.template.html';
import { pubSub } from '../../lib/pubsub';

const galleryPhotoTemplate = document.createElement('template');
galleryPhotoTemplate.innerHTML = template;

/**
 * Attributes { active: boolean, image: string }
 * Output Events [ "photo:selected<id>" ]
 */
class PhotoComponent extends HTMLElement {
  constructor() {
    super();
    this.build();
  }

  static get observedAttributes() {
    return ['active', 'image'];
  }

  build() {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(galleryPhotoTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.photo img').addEventListener('click', this.selectPhoto.bind(this));
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const photoEl = this.shadowRoot.querySelector('.photo');
    let photoImgEl = photoEl.querySelector('.photo-image');

    // set the src of the img element
    if (!photoImgEl) {
      photoImgEl = document.createElement('img');
      photoImgEl.classList.add('photo-image');
      photoImgEl.src = this.getAttribute('image');
      photoEl.appendChild(photoImgEl);
    } else {
      photoImgEl.src = this.getAttribute('image');
      photoEl.appendChild(photoImgEl);
    }

    // set active state
    if (this.active) {
      photoEl.classList.add('photo--active');
    } else {
      photoEl.classList.remove('photo--active');
    }
  }

  selectPhoto() {
    pubSub.publish('photo:selected', this.getAttribute('id'));
  }

  get active() {
    return this.getAttribute('active') === '';
  }

  set active(isActive) {
    if (isActive) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }
}

customElements.define('gallery-photo', PhotoComponent);
