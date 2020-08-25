const Usuario = require('../models/Usuario');
const Session = require('./SessionController');

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

        usuario.senha = undefined;

        return res.json({
            usuario,
            token: Session.generateToken({ id: usuario._id })
        });
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