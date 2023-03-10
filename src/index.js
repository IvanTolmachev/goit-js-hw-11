import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabaySerchImages from './js/fetchImagesPixabayAPI';
import createMarkupImages from './js/create-markup-images';

const simpleLightbox = new SimpleLightbox('.gallery a');
const pixabaySerchImages = new PixabaySerchImages();
let DEBOUNCE_DELAY = 400;
let totalHits = '';

const refs = {
  form: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreWrapper: document.querySelector('.wrapper'),
};

window.addEventListener('scroll', debounce(onScroll, DEBOUNCE_DELAY));

refs.form.addEventListener('submit', onSearch);
refs.form.addEventListener('input', e => {
  if (e.currentTarget.elements.searchQuery.value === '') {
    refs.galleryEl.innerHTML = '';
    refs.loadMoreWrapper.classList.add('is-hidden');
  }
});

async function onSearch(e) {
  e.preventDefault();
  let searchQuery = await e.currentTarget.elements.searchQuery.value.trim();
  pixabaySerchImages.resetPage();
  pixabaySerchImages.query = searchQuery;
  const response = await pixabaySerchImages.getImages();
  const arrayImages = await response.hits;
  totalHits = response.totalHits;
  if (arrayImages.length >= 40) {
    refs.loadMoreWrapper.classList.remove('is-hidden');
  } else {
    refs.loadMoreWrapper.classList.add('is-hidden');
  }
  try {
    if (!response) {
      return;
    }
    if (searchQuery === '') {
      Notify.failure('fill in the search bar!');
      return;
    }

    if (arrayImages.length === 0) {
      refs.galleryEl.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
      return;
    }
    Notify.success(`Hooray! We found  images ${response.totalHits}`);
    refs.galleryEl.innerHTML = '';
    getImagesEl(arrayImages);
    simpleLightbox.refresh();
  } catch {
    console.error('Something went wrong!');
  }
}

async function addFollowingList() {
  pixabaySerchImages.incrementPage();
  const response = await pixabaySerchImages.getImages();
  const arrayImages = await response.hits;
  getImagesEl(arrayImages);
  simpleLightbox.refresh();
}

function onScroll() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  if (position >= threshold) {
    if (Math.ceil(totalHits / 40) === pixabaySerchImages.page) {
      refs.loadMoreWrapper.classList.add('is-hidden');
      setTimeout(() => {
        Notify.failure(
          'happy end, no more images to load. Please enter a different search query'
        );
      }, 300);
      return;
    }
    addFollowingList();
    simpleLightbox.refresh();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

function getImagesEl(e) {
  if (!e) return;
  let markupImg = e.reduce(
    (markup, img) => createMarkupImages(img) + markup,
    ''
  );
  refs.galleryEl.insertAdjacentHTML('beforeend', markupImg);
}
