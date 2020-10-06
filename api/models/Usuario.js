const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: Number,
    required: true,
  },
  sexo: {
    type: String,
    required: true,
  },
  data_nasc: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
    bcrypt: true,
    select: false
  },
  dependentes: [
    {
      nome: {
        type: String
      },
      sexo: {
        type: String
      },
      data_nasc: {
        type: Date
      },
      vacinas: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vacina",
          },
          doseAtual: {
            type: Number,
            default: 0,
          },
          dataDose: {
            type: Date
          },
        },
      ],
    },
  ],
  vacinas: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vacina",
      },
      doseAtual: {
        type: Number,
        default: 0,
      },
      dataDose: {
        type: Date
      },
    },
  ],
});

UsuarioSchema.plugin(require('mongoose-bcrypt'));

module.exports = mongoose.model('Usuario', UsuarioSchema);
