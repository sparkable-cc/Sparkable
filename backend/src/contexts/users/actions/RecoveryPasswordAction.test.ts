import { UserNotFoundException } from "../domain/exceptions/UserNotFoundException";
import { User } from "../domain/models/User";
import { ResetTokenRepositoryInMemory } from "../infrastructure/persistence/repositories/ResetTokenRepositoryInMemory";
import { UserRepositoryInMemory } from "../infrastructure/persistence/repositories/UserRepositoryInMemory";
import { RecoveryPasswordAction } from "./RecoveryPasswordAction";

describe('Recovery password action', () => {
  // let authServiceMock: MockProxy<AuthService>;

  // beforeEach(() => {
  //   authServiceMock = mock<AuthService>();
  // })

  test('Dont send email when user does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const tokenRepository = new ResetTokenRepositoryInMemory();
    const recoveryPasswordAction = new RecoveryPasswordAction(
      userRepository,
      tokenRepository
    );

    await expect(recoveryPasswordAction.execute('user@email.com')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('Send email with temporary link when user exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const tokenRepository = new ResetTokenRepositoryInMemory();
    const email = 'user@email.com';
    userRepository.storeUser(new User(email, 'user', 'password'));
    const recoveryPasswordAction = new RecoveryPasswordAction(
      userRepository,
      tokenRepository
    );

    await recoveryPasswordAction.execute(email);

    expect(tokenRepository.all().length).toEqual(1);
    expect(tokenRepository.all()[0].getToken).not.toBeNull();
  });

});