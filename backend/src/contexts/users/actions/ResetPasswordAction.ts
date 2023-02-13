import { MandatoryFieldEmptyException } from "../domain/exceptions/MandatoryFieldEmptyException";
import { TokenIsExpiredException } from "../domain/exceptions/TokenIsExpiredException";
import { TokenNotFoundException } from "../domain/exceptions/TokenNotFoundException";
import { UserNotFoundException } from "../domain/exceptions/UserNotFoundException";
import { User } from "../domain/models/User";
import { ResetTokenRepository } from "../domain/repositories/ResetTokenRepository";
import { UserRepository } from "../domain/repositories/UserRepository";

export class ResetPasswordAction {
  private userRepository: UserRepository;
  private resetTokenRepository: ResetTokenRepository;
  // private mailerService: MailerService;

  constructor(
    userRepository: UserRepository,
    resetTokenReposity: ResetTokenRepository,
  //  mailerService: MailerService
  ) {
    this.userRepository = userRepository;
    this.resetTokenRepository = resetTokenReposity;
  //  this.mailerService = mailerService;
  }

  async execute(userUuid:string, token: string, password:string) {
    if (!userUuid || !token || !password) throw new MandatoryFieldEmptyException();

    const userDto = await this.userRepository.findUser({uuid: userUuid});
    if (!userDto) throw new UserNotFoundException();

    const user = User.factory(userDto);
    user.setPassword(password);

    const resetToken = await this.resetTokenRepository.findToken({userUuid: userUuid});
    if (!resetToken) throw new TokenNotFoundException();

    const date = new Date();
    date.setDate(date.getDate() - 1);
    if (date > resetToken.createdAt) throw new TokenIsExpiredException;

    await this.userRepository.storeUser(user);
  }

}