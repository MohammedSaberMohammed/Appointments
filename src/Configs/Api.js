import config from 'config';

const NORMAL_BASE_URLS = config.get('SERVER_API_ENDPOING', '/api');

export default {
  baseURL: {
    test: `${NORMAL_BASE_URLS}/`,
  },
};
