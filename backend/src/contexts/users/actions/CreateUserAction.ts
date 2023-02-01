import { EmailExistsException } from '../domain/exceptions/EmailExistsException';
import { ShortPasswordException } from '../domain/exceptions/ShortPasswordException';
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
    await this.checkPasswordIsStrong(password);

    this.userRepository.storeUser(user);
  }

  private async checkUsernameIsNotUsed(username: string) {
    const user = await this.userRepository.findUser('username', username);
    if (user) throw new UsernameExistsException();
  }

  private async checkEmailIsNotUsed(email: string) {
    const user = await this.userRepository.findUser('email', email);
    if (user) throw new EmailExistsException();
  }

  private checkPasswordIsStrong(password: string) {
    if (password.length < 8)
      throw new ShortPasswordException(
        'Password must be at least 8 characters long',
      );

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string, username: string, password: string) {
    const user = new User(email, username, password);

    await this.checkUsernameIsNotUsed(username);
    await this.checkEmailIsNotUsed(email);

    this.userRepository.storeUser(user);
  }

  private async checkUsernameIsNotUsed(username: string) {
    const user = await this.userRepository.findUser('username', username);
    if (user) throw new UsernameExistsException();
  }

  private async checkEmailIsNotUsed(email: string) {
    const user = await this.userRepository.findUser('email', email);
    if (user) throw new EmailExistsException();
  }
}
