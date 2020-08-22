const express = require('express');

const VacinaController = require('./controllers/VacinaController');
const UsuarioController = require('./controllers/UsuarioController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

routes.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
  });

routes.post('/vacina', VacinaController.store);
routes.get('/vacina', VacinaController.index);
routes.get('/vacina/:id', VacinaController.show);
routes.put('/vacina/:id', VacinaController.update);
routes.delete('/vacina/:id', VacinaController.destroy);

routes.post('/usuario', UsuarioController.store);
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.put('/usuario/:id', UsuarioController.update);
routes.delete('/usuario/:id', UsuarioController.destroy);

routes.post('/session', SessionController.store);

module.exports = routes;
