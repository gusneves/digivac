const Usuario = require('../models/Usuario');

const Bcrypt = require('bcryptjs');

module.exports = {
  async store(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      const { senha: senhaBanco } = usuario;
      Bcrypt.compare(senha, senhaBanco, ((err, result) => {
        if (!result) {
          return res.status(400).json({ error: 'Senhas não batem',});
        } else {
          return res.json(usuario);
        }
      }));
    } else {
      return res.status(400).json({ mensagem: 'Usuário não encontrado' });
    }
  }
}
