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

  test('cant sign in because the user does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository, authServiceMock);

    await expect(signInAction.execute('username', 'password')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the password is wrong', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const password = 'password';
    userRepository.storeUser(new User('email', username, password));
    const signInAction = new SignInAction(userRepository, authServiceMock);

    await expect(
      signInAction.execute(username, 'wrong password'),
    ).rejects.toThrow(WrongPasswordException);
  });

  test('can sign in', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const password = 'password';
    userRepository.storeUser(new User('email', username, password));
    const authResponse = {
      access_token:"xxxx",
      expires_in:86400,
      token_type:"Bearer"
    }
    authServiceMock.getToken.mockReturnValue(
      new Promise((resolve) => resolve(authResponse))
    );
    const signInAction = new SignInAction(userRepository, authServiceMock);

    const res = await signInAction.execute(username, password);

    expect(authServiceMock.getToken).toHaveBeenCalled();
    expect(res.token_type).toEqual('Bearer');
    expect(res).toHaveProperty('access_token');
  });

});
