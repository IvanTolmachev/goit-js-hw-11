import './css/styles.css';
// import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getImages from './js/fetchImagesPixabayAPI';
let imgUrl = [];
const refs = {
  form: document.getElementById('search-form'),
  inputEl: document.querySelector('input[name="searchQuery"]'),
  galleryEl: document.querySelector('.gallery'),
};
// console.log(refs.form.value);
refs.inputEl.addEventListener('input', onSearch);
refs.form.addEventListener('submit', getImagesEl);
// refs.form.addEventListener('', getImagesEl);

function onSearch() {
  let value = refs.inputEl.value;
  return getImages(value).then(data => {
    imgUrl = data.data.hits;
  });
}

function getImagesEl(e) {
  e.preventDefault();
  let markupImg = imgUrl.reduce(
    (markup, img) => createMarkupImages(img) + markup,
    ''
  );
  refs.galleryEl.innerHTML = markupImg;
}

function createMarkupImages({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>

  `;
}

// Notify.info('Too many matches found. Please enter a more specific name.');
// Notify.failure('Oops, there is no country with that name');
