export default function addGalleryElements(element, responseAnswerObject) {
  if (!responseAnswerObject || !Array.isArray(responseAnswerObject)) {
    console.error('Помилка: responseAnswerObject не є масивом', responseAnswerObject);
    return;
  }

  const elementsArray = responseAnswerObject.map(item => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = item;

    const addListItem = document.createElement('li');
    addListItem.classList.add('gallery-item');

    const imgLink = document.createElement('a');
    imgLink.classList.add('gallery-link');
    imgLink.href = largeImageURL;

    const addImage = document.createElement('img');
    addImage.alt = tags;
    addImage.src = webformatURL;
    addImage.width = '360';
    addImage.height = '200';
    addImage.classList.add('gallery-image');

    imgLink.appendChild(addImage);
    addListItem.appendChild(imgLink);

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description-container');
    descriptionContainer.innerHTML = `
      <div class="item-desc-container"><span class="description-name">Likes</span><span class="description-counts">${likes}</span></div>
      <div class="item-desc-container"><span class="description-name">Views</span><span class="description-counts">${views}</span></div>
      <div class="item-desc-container"><span class="description-name">Comments</span><span class="description-counts">${comments}</span></div>
      <div class="item-desc-container"><span class="description-name">Downloads</span><span class="description-counts">${downloads}</span></div>
    `;

    addListItem.appendChild(descriptionContainer);
    return addListItem;
  });

  element.append(...elementsArray);
}
