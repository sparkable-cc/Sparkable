import { UserNotFoundException } from "../domain/exceptions/UserNotFoundException";
import { UserRepository } from "../domain/repositories/UserRepository";
import { ResetToken } from "../domain/models/ResetToken";
import { ResetTokenRepository } from "../domain/repositories/ResetTokenRepository";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export class RecoveryPasswordAction {
  private userRepository: UserRepository;
  private resetTokenRepository: ResetTokenRepository

  constructor(
    userRepository: UserRepository,
    resetTokenReposity: ResetTokenRepository
  ) {
    this.userRepository = userRepository;
    this.resetTokenRepository = resetTokenReposity;
  }

  async execute(email: string) {
    const user = await this.userRepository.findUser('email', email);
    if (!user) throw new UserNotFoundException();

    // TEST
    // let token = await Token.findOne({ userId: user.id });
    // if (token) await token.deleteOne();

    //REFACTORING TO ENV?
    const salt = 10;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(salt));
    await this.resetTokenRepository.save(new ResetToken(user.id, hash));

    //const link = `${clientURL}/passwordReset?token=${resetToken}&userId=${user.id}`;
    //sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"./template/requestResetPassword.handlebars");
  }

}