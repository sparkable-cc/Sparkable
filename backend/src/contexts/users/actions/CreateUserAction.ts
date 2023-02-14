import { EmailExistsException } from '../domain/exceptions/EmailExistsException';
import { UsernameExistsException } from '../domain/exceptions/UsernameExistsException';
import { User } from '../domain/models/User';
import { UserRepository } from '../domain/repositories/UserRepository';

export class CreateUserAction {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string, username: string, password: string) {
    const user = new User(email, username, password);

    await this.checkUsernameIsNotUsed(username);
    await this.checkEmailIsNotUsed(email);

    await this.userRepository.storeUser(user);
  }

  private async checkUsernameIsNotUsed(username: string) {
    const user = await this.userRepository.findUser({ username: username });
    if (user) throw new UsernameExistsException();
  }

  private async checkEmailIsNotUsed(email: string) {
    const user = await this.userRepository.findUser({ email: email });
    if (user) throw new EmailExistsException();
  }
}
