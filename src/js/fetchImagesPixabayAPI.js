// const API_KAY = '189ZyJdpS4wFJim3wQVBxdLs9Um5G3K4J3';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
// const BASE_URL = 'https://pixabay.com/api';

const API_KEY = '33676547-1eff083daa4791d6cd59b7c63';
// const IMG_TYPE = 'image_type=photo';

// const options = {
//   headers: {
//     'X-Api-Key':
//   },
// };

export default function getImages(value) {
  // console.log('GET');

  return axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: '5',
      // fields: { likes },
    },
    // fields: { likes },
  });
  // .catch(console.log);
}
