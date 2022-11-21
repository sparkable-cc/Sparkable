import {describe, expect, test} from '@jest/globals';

import CreateUserAction from '../actions/CreateUserAction';
import { EmailExistsException } from '../exceptions/EmailExistsException';
import { MandatoryFieldEmptyException } from '../exceptions/MandatoryFieldEmptyException';
import { UsernameExistsException } from '../exceptions/UsernameExistsException';
import InMemoryUserRepository from '../repositories/InMemoryUserRepository';

describe('Create user action', () => {

  test('cant create user without mandatory field', () => {
    const createUserAction = new CreateUserAction(new InMemoryUserRepository());

    expect(() => createUserAction.execute('','username','password')).toThrow(MandatoryFieldEmptyException);
  });

  test('create user when all field are completed', () => {
    const userRepository = new InMemoryUserRepository();
    const createUserAction = new CreateUserAction(userRepository);
    createUserAction.execute('admin@butterfy.me','admin','password');

    expect(userRepository.existUsername('admin')).toBe(true);
  });

  test('cant create user because the username exists', () => {
    const userRepository = new InMemoryUserRepository();
    const createUserAction = new CreateUserAction(userRepository);
    createUserAction.execute('admin@butterfy.me','admin','password');

    expect(() => createUserAction.execute('admin2@butterfy.me','admin','password')).toThrow(UsernameExistsException);
  });

  test('cant create user because the email is already registered', () => {
    const userRepository = new InMemoryUserRepository();
    const createUserAction = new CreateUserAction(userRepository);
    createUserAction.execute('admin@butterfy.me','admin','password');

    expect(() => createUserAction.execute('admin@butterfy.me','admin2','password')).toThrow(EmailExistsException);
  });

});