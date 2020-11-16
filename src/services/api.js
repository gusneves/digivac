import axios from 'axios';

const api = axios.create({
  baseURL: 'api-db-digivac.herokuapp.com'
});

api.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default api;
