import template from './gallery.template.html';
import style from './gallery.styles.scss';
import { imagesService } from '../../services/images.service';
import { pubSub } from '../../lib/pubsub';

const galleryTemplate = document.createElement('template');
galleryTemplate.innerHTML = template;

class GalleryComponent extends HTMLElement {
  constructor() {
    super();
    this._isLoading = false;
    this.setup();

    this._subscriptions = [
      pubSub.subscribe('photos:updated', (photos) => {
        this.renderThumbnails(photos);
      }),
      pubSub.subscribe('photos:loading-start', () => {
        this.toggleLoading();
      }),
      pubSub.subscribe('photos:loading-end', () => {
        this.toggleLoading();
      }),
      pubSub.subscribe('photo:active', (photo) => {
        this.renderActivePhoto(photo);
      }),
      pubSub.subscribe('error', this.buildAlert.bind(this)),
    ];
  }

  setup() {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(styleEl);
    this.shadowRoot.appendChild(galleryTemplate.content.cloneNode(true));

    const viewerEl = this.shadowRoot.querySelector('gallery-viewer');
    viewerEl.addEventListener('view:next', () => {
      this.next();
    });
    viewerEl.addEventListener('view:previous', () => {
      this.previous();
    });
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('keydown', (ev) => {
      // if we are making a request to the API, prevent any keyboard events
      // to avoid weird thumbnail navigation issues
      if (this._isLoading) {
        return;
      }

      if (ev.key === 'ArrowRight') {
        this.next();
      } else if (ev.key === 'ArrowLeft') {
        this.previous();
      }
    });

    imagesService.loadImages();
  }

  disconnectedCallback() {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  toggleLoading() {
    const loadingComponent = this.shadowRoot.querySelector('gallery-loading');
    loadingComponent.hidden = !loadingComponent.hidden;
    this._isLoading = !loadingComponent.hidden;
  }

  renderThumbnails(photos) {
    this.shadowRoot.querySelector('gallery-thumbnails').photos = photos;
  }

  renderActivePhoto(photo) {
    this.shadowRoot.querySelector('gallery-viewer').photo = photo;
    this.shadowRoot.querySelector('gallery-thumbnails').activePhoto = photo;
  }

  next() {
    imagesService.nextPhoto();
  }

  previous() {
    imagesService.previousPhoto();
  }

  buildAlert({ type, message, dismissable, action }) {
    const alertComponent = document.createElement('gallery-alert');
    alertComponent.setAttribute('type', type);
    alertComponent.setAttribute('message', message);
    if (dismissable) {
      alertComponent.setAttribute('dismissable', '');
    }
    alertComponent.action = action;
    this.shadowRoot.querySelector('.alert-container').appendChild(alertComponent);
  }
}

customElements.define('gallery-app', GalleryComponent);
