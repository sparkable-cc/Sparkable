import bcrypt from 'bcrypt';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from '../domain/exceptions/WrongPasswordException';
import { UserRepository } from '../domain/repositories/UserRepository';
import { AuthService } from '../domain/services/AuthService';

export class SignInAction {
  userRepository: UserRepository;
  authService: AuthService;

  constructor(userRepository: UserRepository, authService: AuthService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async execute(password: string, username?: string, email?: string) {
    let user = null;

    if (username) {
      user = await this.userRepository.findUser('username', username);
    }
    if (email) {
      user = await this.userRepository.findUser('email', email);
    }

    if (!user) throw new UserNotFoundException();

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new WrongPasswordException();

    return await this.authService.getToken();
  }
}
