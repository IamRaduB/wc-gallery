/**
 * @typedef { { query: Object<string, number|string>,
 * headers: Object<string, string> } } RequestOptions
 */

/**
 * Map the dictionary of query params to a url-encoded string
 * @param {Object<string, number|string>} query
 * @returns {string}
 */
function addQueryParams(query) {
  const queryString = Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');

  return `?${queryString}`;
}

export class ApiService {
  constructor() {
    this.apiKey = 'b1a00c2e17c2273f4ba8f6aaeaca36ee';
  }

  /**
   * Perform a GET request using the FETCH api
   * @param { string } url
   * @param { RequestOptions } options
   * @returns {Promise<any>}
   */
  async get(url, options) {
    const urlWithQuery = `${url}${addQueryParams({ ...options.query, api_key: this.apiKey })}`;
    let response;

    try {
      response = await fetch(urlWithQuery);
    } catch (e) {
      console.error('GET error', e);
      throw e;
    }

    if (!response || !response.ok) {
      console.error('Error requesting resource', response);
      throw new Error(response.statusText);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
