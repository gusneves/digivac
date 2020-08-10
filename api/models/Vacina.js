const mongoose = require("mongoose");

const VacinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  doses: {
    type: Number,
  },
  idade_doses: [String]
});

module.exports = mongoose.model('Vacina', VacinaSchema);
