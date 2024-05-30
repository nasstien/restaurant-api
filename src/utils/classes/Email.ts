import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { getResetPasswordHTML } from '@utils/emails';
import { IUser } from 'models/IUser';

class Email {
    private host: string;
    private port: number;
    private user: string;
    private userPassword: string;

    constructor(host: string, port: number, user: string, userPassword: string) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.userPassword = userPassword;
    }

    createTransport() {
        return nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.port === 465,
            auth: {
                user: this.user,
                pass: this.userPassword,
            },
        });
    }

    async sendResetPasswordEmail(
        transporter: Transporter<SMTPTransport.SentMessageInfo>,
        user: IUser,
        resetUrl: string,
    ) {
        const mailOptions = {
            from: 'restaurant.api@example.com',
            to: user.email,
            subject: 'Password Reset Instructions',
            html: getResetPasswordHTML(user.firstName, resetUrl),
        };

        await transporter.sendMail(mailOptions);
    }
}

export default Email;
