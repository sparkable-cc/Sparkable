// import { UserNotFoundException } from "../domain/exceptions/UserNotFoundException";
// import { User } from "../domain/models/User";
// import { MailerService } from "../domain/services/MailerService";
// import { RecoveryPasswordAction } from "./RecoveryPasswordAction";
// import { MockProxy, mock } from 'jest-mock-extended';

import { ResetPasswordAction } from "./ResetPasswordAction";
import { ResetTokenRepositoryInMemory } from "../infrastructure/persistence/repositories/ResetTokenRepositoryInMemory";
import { UserRepositoryInMemory } from "../infrastructure/persistence/repositories/UserRepositoryInMemory";
import { MandatoryFieldEmptyException } from "../domain/exceptions/MandatoryFieldEmptyException";
import { ShortPasswordException } from "../domain/exceptions/ShortPasswordException";
import { UserNotFoundException } from "../domain/exceptions/UserNotFoundException";
import { User } from "../domain/models/User";

describe('Reset password action', () => {
  let userRepository: UserRepositoryInMemory;
  let resetTokenRepository: ResetTokenRepositoryInMemory;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    resetTokenRepository = new ResetTokenRepositoryInMemory();
  })

  test('Cant reset password when userId is a required parameter', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('', '', '')).rejects.toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('Cant reset password when token is a required parameter', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('xxxxxx', '', '')).rejects.toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('Cant reset password when password is a required parameter', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('xxxxxx', 'xxxxxx', '')).rejects.toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('Cant reset password when user not exist in database', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('xxxxxx', 'xxxxxx', '12345678')).rejects.toThrow(
      UserNotFoundException
    );
  });

  test('Cant reset password when password is less 8 length', async () => {
    const user = new User('test@test.com', 'user', 'password');

    userRepository.storeUser(user);
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute(user.getUuid, 'xxxxxx', '1234567')).rejects.toThrow(
      ShortPasswordException
    );
  });

});