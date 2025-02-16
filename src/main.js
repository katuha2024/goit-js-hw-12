import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iconSvgError from './img/error.svg';
import iconSvgWarning from './img/warning.svg';
import getResponseData from './js/pixabay-api.js';
import addGalleryElements from './js/render-functions.js';

document.addEventListener('DOMContentLoaded', () => {
  const galleryList = document.querySelector('.gallery');
  const loaderElement = document.querySelector('.loader');
  const requestForm = document.querySelector('.search-form');
  const loadMoreButton = document.getElementById('loadMoreButton');

  if (!galleryList || !loaderElement || !requestForm) {
    console.error('One or more required elements are missing.');
    return;
  }

  const errFindImagesMessage = {
    message: `Sorry, there are no images matching <br> your search query. Please, try again!`,
    messageColor: '#fff',
    backgroundColor: '#ef4040',
    position: 'topRight',
    iconUrl: iconSvgError,
  };

  const overMaxLengthInputMessage = {
    message: `Перевищено максимально допустиму кількість символів!<br> Допустимо 100 символів.`,
    messageColor: '#fff',
    backgroundColor: '#ffa000',
    position: 'topRight',
    iconUrl: iconSvgWarning,
    displayMode: 'once',
  };

  let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionType: 'attr',
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  });

  requestForm.addEventListener('input', checkMaxLengthRequestWords);
  requestForm.addEventListener('submit', searchImages);
  loadMoreButton.addEventListener('click', loadMoreImages);

  function checkMaxLengthRequestWords(event) {
    if (event.target.value.trim().length > 100) {
      iziToast.show(overMaxLengthInputMessage);
      event.target.value = event.target.value.trim().slice(0, 100);
    }
  }

  async function searchImages(event) {
    event.preventDefault();
    const query = event.currentTarget.requestField.value.trim();
    if (query.length === 0) {
      return;
    }
    loaderElement.classList.remove('visually-hidden');
    galleryList.innerHTML = '';

    try {
      const data = await getResponseData(query);
      console.log('API response data:', data);

      if (!data || !data.hits || data.hits.length === 0) {
        iziToast.show(errFindImagesMessage);
        return;
      }

      addGalleryElements(galleryList, data);
      gallery.refresh();
      toggleLoadMoreButton(data.hits.length >= 15);
    } catch (error) {
      console.error('Error fetching images:', error);
      iziToast.show(errFindImagesMessage);
    } finally {
      loaderElement.classList.add('visually-hidden');
    }
  }

  async function loadMoreImages() {
    const query = requestForm.requestField.value.trim();
    const currentPage = Number(loadMoreButton.dataset.page) || 1;
    loaderElement.classList.remove('visually-hidden');

    try {
      const data = await getResponseData(query, { page: currentPage + 1 });
      console.log('API response data:', data);

      if (!data || !data.hits || data.hits.length === 0) {
        iziToast.show(errFindImagesMessage);
        return;
      }

      addGalleryElements(galleryList, data);
      gallery.refresh();
      loadMoreButton.dataset.page = currentPage + 1;
      toggleLoadMoreButton(data.hits.length >= 15);
    } catch (error) {
      console.error('Error fetching images:', error);
      iziToast.show(errFindImagesMessage);
    } finally {
      loaderElement.classList.add('visually-hidden');
    }
  }

  function toggleLoadMoreButton(show) {
    loadMoreButton.classList.toggle('visually-hidden', !show);
  }
});
