import { describe, expect, test } from '@jest/globals';
import { UserNotFoundException } from '../domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from '../domain/exceptions/WrongPasswordException';
import { User } from '../domain/models/User';
import { UserRepositoryInMemory } from '../infrastructure/persistence/repositories/UserRepositoryInMemory';
import { SignInAction } from './SignInAction';
import { AuthService } from '../domain/services/AuthService';
import { MockProxy, mock } from 'jest-mock-extended';

describe('signing in', () => {
  let authServiceMock: MockProxy<AuthService>;

  beforeEach(() => {
    authServiceMock = mock<AuthService>();
  })

  test('cant sign in because the username does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository, authServiceMock);

    await expect(signInAction.execute('password', 'username')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the email does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository, authServiceMock);

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
    const signInAction = new SignInAction(userRepository, authServiceMock);

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

    var date = new Date();
    date.setDate(date.getDate() + 2);
    const authResponse = {
      access_token:"xxxx",
      expires_in: date,
      token_type:"Bearer"
    }
    authServiceMock.getToken.mockReturnValue(
      new Promise((resolve) => resolve(authResponse))
    );

    const signInAction = new SignInAction(userRepository, authServiceMock);

    const res = await signInAction.execute(password, username);

    expect(authServiceMock.getToken).toHaveBeenCalled();
    expect(res.token_type).toEqual('Bearer');
    expect(res.access_token).toEqual('xxxx');
  });

  test('can sign in with email', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const email = 'email';
    const password = 'password';
    userRepository.storeUser(new User(email, username, password));

    var date = new Date();
    date.setDate(date.getDate() + 2);
    const authResponse = {
      access_token:"xxxx",
      expires_in: date,
      token_type:"Bearer"
    }
    authServiceMock.getToken.mockReturnValue(
      new Promise((resolve) => resolve(authResponse))
    );

    const signInAction = new SignInAction(userRepository, authServiceMock);

    const res = await signInAction.execute(password, '', email);

    expect(authServiceMock.getToken).toHaveBeenCalled();
    expect(res.token_type).toEqual('Bearer');
    expect(res.access_token).toEqual('xxxx');
  });
});
