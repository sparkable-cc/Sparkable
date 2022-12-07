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
    if (user.password !== password) throw new WrongPasswordException();
    return user;
  }
}
