import { describe, expect, test } from '@jest/globals';
import bcrypt from 'bcrypt';
import { EmailExistsException } from '../domain/exceptions/EmailExistsException';
import { MandatoryFieldEmptyException } from '../domain/exceptions/MandatoryFieldEmptyException';
import { ShortPasswordException } from '../domain/exceptions/ShortPasswordException';
import { UsernameExistsException } from '../domain/exceptions/UsernameExistsException';
import { User } from '../domain/models/User';
import { UserRepositoryInMemory } from '../infrastructure/persistence/repositories/UserRepositoryInMemory';
import { CreateUserAction } from './CreateUserAction';

describe('Create user action', () => {
  test('cant create user without mandatory field', async () => {
    const createUserAction = new CreateUserAction(new UserRepositoryInMemory());

    await expect(
      createUserAction.execute('', 'username', 'password'),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('create user when all field are completed', async () => {
    const userRepository = new UserRepositoryInMemory();
    const createUserAction = new CreateUserAction(userRepository);
    const username = 'admin';

    await createUserAction.execute('admin@butterfy.me', username, 'password');

    const user = await userRepository.findUser({ username: username });
    expect(user?.username).toEqual(username);
    expect(user?.stage).toEqual(1);
  });

  test('cant create user because the username exists', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'admin';
    await userRepository.storeUser(
      new User('admin@butterfy.me', username, 'password'),
    );
    const createUserAction = new CreateUserAction(userRepository);

    await expect(
      createUserAction.execute('admin2@butterfy.me', username, 'password'),
    ).rejects.toThrow(UsernameExistsException);
  });

  test('cant create user because the email is already registered', async () => {
    const userRepository = new UserRepositoryInMemory();
    const email = 'admin@butterfy.me';
    await userRepository.storeUser(new User(email, 'admin', 'password'));
    const createUserAction = new CreateUserAction(userRepository);

    await expect(
      createUserAction.execute(email, 'admin2', 'password'),
    ).rejects.toThrow(EmailExistsException);
  });

  test('cant create user because the password is not 8 characters', async () => {
    const userRepository = new UserRepositoryInMemory();
    const createUserAction = new CreateUserAction(userRepository);

    await expect(
      createUserAction.execute('email', 'username', 'pass'),
    ).rejects.toThrow(ShortPasswordException);
  });

  test('password is encrypted when create user', async () => {
    const userRepository = new UserRepositoryInMemory();
    const createUserAction = new CreateUserAction(userRepository);
    const username = 'admin';
    const password = 'password';

    await createUserAction.execute('admin@butterfy.me', username, password);

    const user = await userRepository.findUser({ username: username });
    expect(await bcrypt.compare(password, user?.password as string)).toBe(true);
  });
});
