import {describe, expect, test} from '@jest/globals';
import bcrypt from 'bcrypt';

import { CreateUserAction } from './CreateUserAction';
import { EmailExistsException } from '../domain/exceptions/EmailExistsException';
import { MandatoryFieldEmptyException } from '../domain/exceptions/MandatoryFieldEmptyException';
import { UsernameExistsException } from '../domain/exceptions/UsernameExistsException';
import { UserRepositoryInMemory } from '../infrastructure/persistence/repositories/UserRepositoryInMemory';

describe('Create user action', () => {

  test('cant create user without mandatory field', async () => {
    const createUserAction = new CreateUserAction(new UserRepositoryInMemory());

    await expect(createUserAction.execute('','username','password')).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('create user when all field are completed', async () => {
    const userRepository = new UserRepositoryInMemory();
    const createUserAction = new CreateUserAction(userRepository);
    const username = 'admin';
    await createUserAction.execute('admin@butterfy.me',username,'password');

    const user = await userRepository.findUser('username', username);
    expect(user?.username).toEqual(username);
  });

  test('cant create user because the username exists', async () => {
    const userRepository = new UserRepositoryInMemory();
    const createUserAction = new CreateUserAction(userRepository);
    await createUserAction.execute('admin@butterfy.me','admin','password');

    await expect(createUserAction.execute('admin2@butterfy.me','admin','password')).rejects.toThrow(UsernameExistsException);
  });

  test('cant create user because the email is already registered', async () => {
    const userRepository = new UserRepositoryInMemory();
    const createUserAction = new CreateUserAction(userRepository);
    await createUserAction.execute('admin@butterfy.me','admin','password');

    await expect(createUserAction.execute('admin@butterfy.me','admin2','password')).rejects.toThrow(EmailExistsException);
  });

  test('password is encrypted when create user', async () => {
    const userRepository = new UserRepositoryInMemory();
    const createUserAction = new CreateUserAction(userRepository);
    const username = 'admin';
    const password = 'password';
    await createUserAction.execute('admin@butterfy.me',username,password);

    const user = await userRepository.findUser('username', username);
    expect(await bcrypt.compare(password, user?.password as string)).toBe(true);
  });

    // //REFACTORING USER CLASS PRIVATE PROPERTIES!

});