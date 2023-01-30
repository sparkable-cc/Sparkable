import bcrypt from 'bcrypt';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from '../domain/exceptions/WrongPasswordException';
import { UserRepository } from '../domain/repositories/UserRepository';

export class SignInAction {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(username: string, password: string) {
    const user = await this.userRepository.findUser('username', username);
    if (!user) throw new UserNotFoundException();

    const match = await bcrypt.compare(password, user.password);
    if (match) return user;
    else throw new WrongPasswordException();
  }

  async executeWithEmail(email: string, password: string) {
    const user = await this.userRepository.findUser('email', email);
    if (!user) throw new UserNotFoundException();

    const match = await bcrypt.compare(password, user.password);
    if (match) return user;
    else throw new WrongPasswordException();
  }
}
