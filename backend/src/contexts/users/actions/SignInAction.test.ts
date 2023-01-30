import { describe, expect, test } from '@jest/globals';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from '../domain/exceptions/WrongPasswordException';
import { User } from '../domain/models/User';
import { UserRepositoryInMemory } from '../infrastructure/persistence/repositories/UserRepositoryInMemory';
import { SignInAction } from './SignInAction';

describe('signing in', () => {
  test('cant sign in because the user does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository);

    await expect(signInAction.execute('username', 'password')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the email does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository);

    await expect(
      signInAction.executeWithEmail('email', 'password'),
    ).rejects.toThrow(UserNotFoundException);
  });

  test('cant sign in because the password is wrong', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const password = 'password';
    userRepository.storeUser(new User('email', username, password));
    const signInAction = new SignInAction(userRepository);

    await expect(
      signInAction.execute(username, 'wrong password'),
    ).rejects.toThrow(WrongPasswordException);
  });

  test('can sign in', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const password = 'password';
    userRepository.storeUser(new User('email', username, password));
    const signInAction = new SignInAction(userRepository);

    const user = await signInAction.execute(username, password);

    expect(user.username).toEqual(username);
  });

  test('can sign in with email', async () => {
    const userRepository = new UserRepositoryInMemory();
    const email = 'email';
    const password = 'password';
    userRepository.storeUser(new User(email, 'username', password));
    const signInAction = new SignInAction(userRepository);

    const user = await signInAction.executeWithEmail(email, password);

    expect(user.email).toEqual(email);
  });
});
