const Bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const Usuario = require('../models/Usuario');
const authConfig = require('../config/auth.json');

module.exports = {
  generateToken(params = {}) {
    return JWT.sign(params, authConfig.secret, {
      expiresIn: 86400, // 86400 segundos = 1 dia
    });
  },

  async store(req, res) {

    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email }).select('+senha');

    if (usuario) {
      const { senha: senhaBanco } = usuario;
      Bcrypt.compare(senha, senhaBanco, ((err, result) => {
        if (!result) {
          return res.status(400).json({ erro: 'Senhas não batem' });
        } else {
          usuario.senha = undefined;

          return res.json({
            usuario, 
            token: module.exports.generateToken({ id: usuario._id })
          });
        }
      }));
    } else {
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    }
  }
}
