import { MandatoryFieldEmptyException } from "../domain/exceptions/MandatoryFieldEmptyException";
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

  async execute(uuid:string, token: string, password:string) {
    if (!uuid || !token || !password) throw new MandatoryFieldEmptyException();

    const userDto = await this.userRepository.findUser({uuid: uuid});
    if (!userDto) throw new UserNotFoundException();

    const user = User.factory(userDto);
    user.setPassword(password);

  //   const resetToken = await this.createToken(user);
  //   await this.sendEmail(resetToken, user);
  // }

  // private async createToken(user:UserDto): Promise<string> {
  //   const resetToken = crypto.randomBytes(32).toString("hex");
  //   dotenv.config();
  //   const hash = await bcrypt.hash(resetToken, Number(process.env.SALT));
  //   await this.resetTokenRepository.save(new ResetToken(user.id, hash));

  //   return resetToken;
  }

}