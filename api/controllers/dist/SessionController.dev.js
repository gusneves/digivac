"use strict";

var Usuario = require('../models/Usuario');

var Bcrypt = require('bcryptjs');

module.exports = {
  store: function store(req, res) {
    var _req$body, email, senha, usuario, senhaBanco;

    return regeneratorRuntime.async(function store$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            _req$body = req.body, email = _req$body.email, senha = _req$body.senha;
            _context.next = 5;
            return regeneratorRuntime.awrap(Usuario.findOne({
              email: email
            }));

          case 5:
            usuario = _context.sent;

            if (!usuario) {
              _context.next = 11;
              break;
            }

            senhaBanco = usuario.senha;
            Bcrypt.compare(senha, senhaBanco, function (err, result) {
              if (!result) {
                return res.status(400).json({
                  error: 'Senhas não batem'
                });
              } else {
                return res.json(usuario);
              }
            });
            _context.next = 12;
            break;

          case 11:
            return _context.abrupt("return", res.status(400).json({
              mensagem: 'Usuário não encontrado'
            }));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};