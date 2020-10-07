import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.10.10.10:3000'
});

api.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default api;
