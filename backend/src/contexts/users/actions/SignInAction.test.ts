import { describe, expect, test } from '@jest/globals';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from '../domain/exceptions/WrongPasswordException';
import { User } from '../domain/models/User';
import { UserRepositoryInMemory } from '../infrastructure/persistence/repositories/UserRepositoryInMemory';
import { SignInAction } from './SignInAction';

describe('signing in', () => {
  test('cant sign in because the username does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository);

    await expect(signInAction.execute('password', 'username')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the email does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository);

    await expect(signInAction.execute('password', 'email')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the password is wrong', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const email = 'email';
    const password = 'password';
    userRepository.storeUser(new User(email, username, password));
    const signInAction = new SignInAction(userRepository);

    await expect(
      signInAction.execute('wrong password', username, email),
    ).rejects.toThrow(WrongPasswordException);
  });

  test('can sign in with username', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const email = 'email';
    const password = 'password';
    userRepository.storeUser(new User(email, username, password));
    const signInAction = new SignInAction(userRepository);

    const user = await signInAction.execute(password, username);

    expect(user.username).toEqual(username);
  });

  test('can sign in with email', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const email = 'email';
    const password = 'password';
    userRepository.storeUser(new User(email, username, password));
    const signInAction = new SignInAction(userRepository);

    const user = await signInAction.execute(password, '', email);

    expect(user.email).toEqual(email);
  });
});
