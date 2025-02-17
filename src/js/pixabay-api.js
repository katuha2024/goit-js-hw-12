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

  const { data } = await axios.get('', {
    params: requestParams,
  });
  return data;
}