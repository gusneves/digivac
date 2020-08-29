"use strict";

var express = require('express');

var VacinaController = require('./controllers/VacinaController');

var UsuarioController = require('./controllers/UsuarioController');

var SessionController = require('./controllers/SessionController');

var routes = express.Router();
routes.post('/vacina', VacinaController.store);
routes.get('/vacina', VacinaController.index);
routes.get('/vacina/:id', VacinaController.show);
routes.put('/vacina/:id', VacinaController.update);
routes["delete"]('/vacina/:id', VacinaController.destroy);
routes.post('/usuario', UsuarioController.store);
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.put('/usuario/:id', UsuarioController.update);
routes["delete"]('/usuario/:id', UsuarioController.destroy);
routes.post('/session', SessionController.store);
module.exports = routes;