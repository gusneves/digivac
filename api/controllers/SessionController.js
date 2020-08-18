const Usuario = require('../models/Usuario');

const Bcrypt = require('bcryptjs');

module.exports = {
  async store(req, res) {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      const { senha: senhaBanco } = usuario;
      Bcrypt.compare(senha, senhaBanco, ((err, result) => {
        if (!result) {
          res.json({ error: 'Senhas não batem',});
        } else {
          res.json(usuario);
        }
      }));
    } else {
      return res.json({ mensagem: 'Usuário não encontrado' });
    }
  }
}
