const JWT = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
  const authHedaer = req.header('Authorization');

  if (!authHedaer) {
    return res.status(401).json({ erro: 'Token não identificado' });
  }

  const parts = authHedaer.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ erro: 'Erro no token' });
  }

  const [ scheme, token ] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: 'Token formatado errado' });
  }

  JWT.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: 'Token inválido' });
    }

    req.usuarioId = decoded.id;

    return next();
  });  
}