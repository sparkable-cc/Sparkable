import { describe, expect, test } from '@jest/globals';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from '../domain/exceptions/WrongPasswordException';
import { UserRepositoryInMemory } from '../infrastructure/persistence/repositories/UserRepositoryInMemory';
import { SignInAction } from './SignInAction';

describe('signing in', () => {
  test('can sign in', async () => {
    const userRepository = new UserRepositoryInMemory();
    // const createUserAction = new CreateUserAction(userRepository);
    const signInAction = new SignInAction(userRepository);
    const username = 'username';
    const password = 'password';
    await SignInAction.execute(username, 'password');

    const user = await signInAction.execute(username, password);
    expect(user.username).toEqual(username);
  });

  test('cant sign in because the user does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository);

    await expect(signInAction.execute('username', 'password')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the password is wrong', async () => {
    const userRepository = new UserRepositoryInMemory();
    // const createUserAction = new CreateUserAction(userRepository);
    const signInAction = new SignInAction(userRepository);
    const username = 'username';
    const password = 'password';
    await SignInAction.execute(username, password);

    await expect(
      signInAction.execute(username, 'wrong password'),
    ).rejects.toThrow(WrongPasswordException);
  });
});
