const Usuario = require('../models/Usuario');

module.exports = {
    async index(req, res){
        const usuario = await Usuario.find();
        return res.json(usuario);
    },
    async store(req, res){
        const { email } = req.body;
        
        const emailVerify = await Usuario.findOne({ email });

        if (emailVerify) {
            return res.json({ mensagem: 'E-mail já utilizado' });
        }

        const usuario = await Usuario.create(req.body);

        return res.json(usuario);
    },
    async show(req, res){
        const usuario = await Usuario.findById(req.params.id);
        return res.json(usuario);
    },
    
    async update(req, res){
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(usuario);
    },

    async destroy(req, res){
        await Usuario.findByIdAndDelete(req.params.id);
        return res.send();
    }
}