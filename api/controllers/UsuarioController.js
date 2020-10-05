const Usuario = require("../models/Usuario");
const Session = require("./SessionController");

module.exports = {
    async index(req, res) {
        const usuario = await Usuario.find();
        return res.json(usuario);
    },
    async store(req, res) {
        try {
            const { email } = req.body;
            const { cpf } = req.body;

            const cpfVerify = await Usuario.findOne({ cpf });
            if (cpfVerify) {
                return res.json({
                    errorMessage: "CPF já cadastrado!",
                    field: "cpf",
                });
            }

            const emailVerify = await Usuario.findOne({ email });
            if (emailVerify) {
                return res.json({
                    errorMessage: "E-mail já cadastrado!",
                    field: "email",
                });
            }

            const usuario = await Usuario.create(req.body);

            usuario.senha = undefined;

            res.status(200).send({
                usuario,
                token: Session.generateToken({ id: usuario._id }),
            });
        } catch (e) {
            return res.json(e)
        }
    },

    async show(req, res) {
        const usuario = await Usuario.findById(req.params.id);
        return res.json(usuario);
    },

    async update(req, res) {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        return res.json(usuario);
    },

    async updateDep(req, res) {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { $push: { dependentes: req.body } },
            { new: true }
        );
        return res.json(usuario);
    },

    async destroy(req, res) {
        await Usuario.findByIdAndDelete(req.params.id);
        return res.send();
    },
};
