import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33676547-1eff083daa4791d6cd59b7c63';

export default class PixabaySerchImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getImages() {
    try {
      console.log(this);

      const requestData = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: this.page,
        },
      });

      return requestData.data;
    } catch {
      console.error('Something went wrong!');
    }
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
