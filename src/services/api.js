import axios from 'axios';

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://192.168.0.112:3000'
=======
  baseURL: 'http://192.168.0.16:3000'
>>>>>>> homePage
});

api.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default api;
