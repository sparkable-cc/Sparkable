import request from 'supertest';
import app from '../../app';
import { ResetToken } from '../../contexts/users/domain/models/ResetToken';
import { User } from '../../contexts/users/domain/models/User';
import { ResetTokenEntity } from '../../contexts/users/infrastructure/persistence/entities/ResetTokenEntity';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { ResetTokenRepositoryPG } from '../../contexts/users/infrastructure/persistence/repositories/ResetTokenRepositoryPG';
import { UserRepositoryPG } from '../../contexts/users/infrastructure/persistence/repositories/UserRepositoryPG';
import dataSource from '../../data-source';
import bcrypt from 'bcrypt';

describe('POST /reset-password', () => {

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const tokenRepository = dataSource.getRepository(ResetTokenEntity);
    await tokenRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.clear();
  });

  it('returns 400 when the body is empty', async () => {
    const res = await request(app).post('/reset-password').send({});

    expect(res.statusCode).toEqual(400);
  });

  it('returns 404 when the user does not exist', async () => {
    const res = await request(app).post('/reset-password').send({
      userUuid: 'xxx',
      token: 'xxx',
      password: 'xxx'
    });

    expect(res.statusCode).toEqual(404);
  });

  it('returns 404 when the token does not exist', async () => {
    const userRepository = new UserRepositoryPG(dataSource);
    const user = new User(
      'email@email.com',
      'username',
      'password',
      'xxxxx'
    );
    await userRepository.storeUser(user);

    const res = await request(app).post('/reset-password').send({
      userUuid: user.getUuid,
      token: 'xxx',
      password: 'newpassword'
    });

    expect(res.statusCode).toEqual(404);
  });

  it('returns 401 when the token is expired', async () => {
    const userRepository = new UserRepositoryPG(dataSource);
    const user = new User(
      'email@email.com',
      'username',
      'password',
      'xxxxx'
    );
    await userRepository.storeUser(user);

    const resetTokenRepository = new ResetTokenRepositoryPG(dataSource);
    const token = 'XXXXXXX';
    const dateExpired = new Date();
    dateExpired.setDate(dateExpired.getDate() - 1);
    const resetToken = new ResetToken(user.getUuid, token, dateExpired);
    await resetTokenRepository.saveToken(resetToken);

    const res = await request(app).post('/reset-password').send({
      userUuid: user.getUuid,
      token: token,
      password: 'newpassword'
    });

    expect(res.statusCode).toEqual(401);
  });

  it('returns 200 when the password is reset', async () => {
    const userRepository = new UserRepositoryPG(dataSource);
    const username = 'username';
    const user = new User(
      'email@email.com',
      username,
      'password',
      'xxxxx'
    );
    await userRepository.storeUser(user);

    const resetTokenRepository = new ResetTokenRepositoryPG(dataSource);
    const token = 'XXXXXXX';
    const resetToken = new ResetToken(user.getUuid, token);
    await resetTokenRepository.saveToken(resetToken);

    const newPassword = 'newpassword';
    const res = await request(app).post('/reset-password').send({
      userUuid: user.getUuid,
      token: token,
      password: newPassword
    });

    expect(res.statusCode).toEqual(200);
    const userDto = await userRepository.findUser({ username: username });
    expect(await bcrypt.compare(newPassword, userDto?.password as string)).toBe(true);
  });

});