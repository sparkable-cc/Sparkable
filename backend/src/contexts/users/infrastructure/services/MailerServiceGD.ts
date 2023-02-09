import dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import { MailOptionsDto } from "../../domain/models/MailOptionsDto";
import { MailerService } from "../../domain/services/MailerService";

export class MailerServiceGD implements MailerService {

  async sendEmail(mailOptions: MailOptionsDto) {
    dotenv.config();

    const smtpConfig: SMTPTransport.Options = {
      host: String(process.env.MAIL_HOST) || '',
      secure: true,
      tls: {
          ciphers:'SSLv3'
      },
      requireTLS:true,
      port: Number(process.env.MAIL_PORT) || 0,
      debug: true,
      auth: {
        user: String(process.env.MAIL_USER),
        pass: String(process.env.MAIL_PASSWORD),
      }
    };

    const mailer = nodemailer.createTransport(smtpConfig);
    mailer.sendMail(mailOptions);
  }

}