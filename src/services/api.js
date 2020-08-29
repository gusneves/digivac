import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});
api.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default api;