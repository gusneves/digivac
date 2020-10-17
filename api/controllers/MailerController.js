/*const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    auth: {
        user: "digivac2020@gmail.com",
        pass: "digivacMailer",
    },
});

let mailOptions = {
    from: "digivac2020@gmail.com",
    to: "",
    subject: "",
    html: "",
};

module.exports = {
    informSignUp(req, res) {
        const mailContent = `<html lang="pt-br"> <head> <style> div { display: flex; max-width: 500px; padding: 10px; flex: 1; flex-direction: column; justify-content: center; align-items: center; } p { font-size: 16px; font-family: Arial, Helvetica, sans-serif; color: #555; text-align: justify; } </style> </head> <body> <div> <p> Obrigado, ${req.body.userName}, seu cadatro na DigiVac, a sua carteira de vacinação digital, foi realizado com sucesso! Nossa equipe agradece! </p> </div> </body> </html>`;
        mailOptions.subject = "Cadastro confirmado";
        mailOptions.html = mailContent;
        mailOptions.to = req.body.userEmail;
        transporter
            .sendMail(mailOptions)
            .then((info) => {
                res.send(info);
            })
            .catch((error) => {
                req.send(error);
            });
    },
};
*/
