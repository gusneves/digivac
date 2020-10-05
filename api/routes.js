const express = require('express');

const authMiddleware = require('./middlewares/Authentication');

const VacinaController = require('./controllers/VacinaController');
const UsuarioController = require('./controllers/UsuarioController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

routes.post('/vacina', VacinaController.store);
routes.get('/vacina', VacinaController.index);
routes.get('/vacina/:id', VacinaController.show);
routes.put('/vacina/:id', VacinaController.update);
routes.delete('/vacina/:id', VacinaController.destroy);

routes.post('/usuario', UsuarioController.store);
routes.get('/usuario', UsuarioController.index);
routes.get('/usuario/:id', UsuarioController.show);
routes.put('/usuario/:id', UsuarioController.update);
routes.put('/usuario/dep/:id', UsuarioController.updateDep);
routes.delete('/usuario/:id', UsuarioController.destroy);

routes.post('/session', SessionController.store);
routes.get('/session/authentication', authMiddleware, (req, res) => {
  return res.json({ 
    ok: true, 
    id: req.usuarioId 
  });
});

module.exports = routes;
