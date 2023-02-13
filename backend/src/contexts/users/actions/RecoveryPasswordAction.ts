import { UserNotFoundException } from "../domain/exceptions/UserNotFoundException";
import { UserRepository } from "../domain/repositories/UserRepository";
import { ResetToken } from "../domain/models/ResetToken";
import { ResetTokenRepository } from "../domain/repositories/ResetTokenRepository";
import { MailerService } from "../domain/services/MailerService";
import { MandatoryFieldEmptyException } from "../domain/exceptions/MandatoryFieldEmptyException";
import { UserDto } from "../domain/models/UserDto";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export class RecoveryPasswordAction {
  private userRepository: UserRepository;
  private resetTokenRepository: ResetTokenRepository;
  private mailerService: MailerService;

  constructor(
    userRepository: UserRepository,
    resetTokenReposity: ResetTokenRepository,
    mailerService: MailerService
  ) {
    this.userRepository = userRepository;
    this.resetTokenRepository = resetTokenReposity;
    this.mailerService = mailerService;
  }

  async execute(email: string) {
    if (!email) throw new MandatoryFieldEmptyException();

    const user = await this.userRepository.findUser({email: email});
    if (!user) throw new UserNotFoundException();

    const resetToken = await this.createToken(user);
    await this.sendEmail(resetToken, user);
  }

  private async createToken(user:UserDto): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString("hex");
    dotenv.config();
    const hash = await bcrypt.hash(resetToken, Number(process.env.SALT));
    await this.resetTokenRepository.saveToken(new ResetToken(user.uuid, hash));

    return resetToken;
  }

  private async sendEmail(resetToken:string, user: UserDto) {
    const link = `${process.env.CLIENT}/passwordReset?token=${resetToken}&userUuid=${user.uuid}`;

    const mailOptions = {
      from: 'noreply@butterfy.me',
      to: user.email,
      subject: 'Password Reset Request',
      html:
        `
        <html>
        <head>
            <style>
            </style>
        </head>
        <body>
            <p>Hi ${user.username},</p>
            <p>You requested to reset your password.</p>
            <p> Please, click the link below to reset your password
            <a href="${link}">Reset Password</a></p>
        </body>
        </html>
        `
    }
    await this.mailerService.sendEmail(mailOptions);
  }

}