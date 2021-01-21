import { apiService as apiServ } from './api.service';

export class ImagesProvider {
  constructor(apiService = apiServ) {
    this.apiService = apiService;
  }

  /**
   * Loads a page of 20 images from Flickr
   * @param { { search: string, perPage: number, page: number } } options
   * @returns {Promise<FlickrPhotoSearch>}
   */
  async loadImages({ page, perPage, search }) {
    /**
     * @type FlickrPhotoSearch
     */
    return this.apiService.get('https://www.flickr.com/services/rest/', {
      query: {
        method: 'flickr.photos.search',
        format: 'json',
        nojsoncallback: 1,
        tags: search,
        per_page: perPage,
        page,
      },
    });
  }
}

export const imagesProvider = new ImagesProvider();
