const Vacina = require('../models/Vacina');

module.exports = {
    async index(req, res){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        const vacina = await Vacina.find();
        return res.json(vacina);
    },
    async store(req, res){
        const vacina = await Vacina.create(req.body);
        return res.json(vacina);
    },
    async show(req, res){
        const vacina = await Vacina.findById(req.params.id);
        return res.json(vacina);
    },
    async update(req, res){
        const vacina = await Vacina.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(vacina);
    },
    async destroy(req, res){
        const vacina = await Vacina.findByIdAndDelete(req.params.id);
        return res.send();
    }
};