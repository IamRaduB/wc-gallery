/**
 * @typedef {{ id: string, secret: string, server: string, title: string }} FlickrPhoto
 * @typedef { { photos: { page: number, pages: number, perPage: number, photo: FlickrPhoto } } } FlickrPhotoSearch
 * @typedef { { id: string, title: string, thumbnail: string, large: string } } Photo
 */
import { imagesProvider as imagesProv } from './images.provider';
import { pubSub as ps } from '../lib/pubsub';

export class ImagesService {
  constructor(imagesProvider = imagesProv, pubSub = ps) {
    this.imagesProvider = imagesProvider;
    this.pubSub = pubSub;
    this.perPage = 5;
    this.photos = [];
    this.currentPage = 1;
    this.currentIndex = -1;
    this.pages = 0;
    this.activePhoto = null;

    pubSub.subscribe('photo:selected', (id) => {
      const index = this.photos.findIndex((photo) => `photo_${photo.id}` === id);
      this.currentIndex = index;
      this.setActivePhoto(index);
    });
  }

  static generateThumbnailUrl(photo) {
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
  }

  static generateLargeImageUrl(photo) {
    return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`;
  }

  async loadImages() {
    this.pubSub.publish('photos:loading-start');
    try {
      const { photos } = await this.imagesProvider.loadImages({
        search: 'cats',
        page: this.currentPage,
        perPage: this.perPage,
        content_type: 1,
      });

      this.pages = photos.pages;

      const galleryPhotos = photos.photo.map((photo) => ({
        id: photo.id,
        title: photo.title,
        thumbnail: ImagesService.generateThumbnailUrl(photo),
        large: ImagesService.generateLargeImageUrl(photo),
      }));

      this.setPhotos(galleryPhotos);
    } catch (e) {
      this.pubSub.publish('error', {
        type: 'error',
        message: 'Error retrieving photos',
        dismissable: true,
        action: {
          execute: this.loadImages.bind(this),
          label: 'Retry',
        },
      });
      console.error(e);
    } finally {
      this.pubSub.publish('photos:loading-end');
    }
  }

  setActivePhoto(index) {
    this.activePhoto = this.photos[index];
    if (!this.activePhoto) {
      throw new Error(`Photo with id ${this.activePhoto.id} not found`);
    }
    this.pubSub.publish('photo:active', this.activePhoto);

    // if we are near the end of the current page
    // and we have more pages available
    // load images on the next page
    if (this.currentIndex >= this.photos.length - 2 && this.hasMorePages()) {
      this.currentPage += 1;
      this.loadImages();
    }
  }

  nextPhoto() {
    this.currentIndex += 1;
    // if we have reached the end of the list of photos
    // go back to the first one
    if (this.currentIndex === this.photos.length - 1 && this.hasMorePages()) {
      this.currentIndex = 0;
    }

    this.setActivePhoto(this.currentIndex);
  }

  previousPhoto() {
    this.currentIndex -= 1;
    // if we have reached the first photo
    // don't progress further
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }

    this.setActivePhoto(this.currentIndex);
  }

  /**
   * Joins the existing list of photos with the new page of elements
   * removing duplicates
   * @param {Photo[]} photos
   */
  setPhotos(photos) {
    // join the 2 lists and remove duplicates
    this.photos.push(
      ...photos.filter((newPhoto) => this.photos.findIndex((existingPhoto) => newPhoto.id === existingPhoto.id) === -1)
    );
    this.pubSub.publish('photos:updated', this.photos);

    if (this.currentPage === 1) {
      this.nextPhoto();
    }
  }

  hasMorePages() {
    return this.currentPage < this.pages;
  }
}

export const imagesService = new ImagesService();
