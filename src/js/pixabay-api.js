import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default async function getResponseData(
  requestWords,
  additionalParams = {}
) {
  const requestParams = {
    key: '48738449-8ffa6e5ebe5c10d7deb01fabe',
    q: requestWords,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    ...additionalParams,
  };

  try {
    const { data } = await axios.get('https://pixabay.com/api/', { params: requestParams });

    console.log('API Response:', data); // Додаємо логування

    if (!data.hits) {
      throw new Error('Неправильний формат відповіді API');
    }

    return data.hits; // Повертаємо тільки масив зображень
  } catch (error) {
    console.error('Помилка отримання даних:', error);
    return []; // Повертаємо порожній масив у разі помилки
  }
}
