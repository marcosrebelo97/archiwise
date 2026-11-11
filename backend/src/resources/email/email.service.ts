import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { create } from "express-handlebars"; // Correto!
import path from "path";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

transporter.use(
    "compile",
    hbs({
        viewEngine: create({
            extname: ".hbs",
            partialsDir: path.resolve(__dirname, "../../views/email/"),
            defaultLayout: false,
        }),
        viewPath: path.resolve(__dirname, "../../views/email/"),
        extName: ".hbs",
    })
);

export const sendPasswordResetEmail = async (email: string, token: string, host: string) => {
    const resetLink = `${host}/reset-password?token=${token}`;

    const mailOptions = {
        from: `"Equipe ArchiWise" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Recuperação de Senha",
        template: "password-reset",
        context: {
            resetLink,
        },
    };

    return transporter.sendMail(mailOptions);
};
