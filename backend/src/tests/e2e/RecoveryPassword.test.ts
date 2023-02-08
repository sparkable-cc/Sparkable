import request from 'supertest';
import app from '../../app';
import { ResetTokenEntity } from '../../contexts/users/infrastructure/persistence/entities/ResetTokenEntity';
import dataSource from '../../data-source';

describe('POST /recovery-password', () => {

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(ResetTokenEntity);
    await repository.delete({});
  });

  it('returns 400 when the body is empty', async () => {
    const res = await request(app).post('/recovery-password').send({});

    expect(res.statusCode).toEqual(400);
  });

  it('returns 200 when the email does not exist', async () => {
    const res = await request(app).post('/recovery-password').send({
      email: 'test@test.com'
    });

    expect(res.statusCode).toEqual(200);
  });

  it('returns 200 when the mail to reset password is sended', async () => {
    const email = 'test@butterfy.me';
    await request(app).post('/user').send({
      email: email,
      username: 'admin',
      password: 'password',
    });

    const res = await request(app).post('/recovery-password').send({
      email: email
    });

    expect(res.statusCode).toEqual(200);
    const resetTokenRepository = dataSource.getRepository(ResetTokenEntity);
    const result = await resetTokenRepository.findAndCount();
    const tokens = result[0];
    const total = result[1];
    expect(total).toEqual(1);
    expect(tokens[0].token).not.toBeNull();
  });

  it('update the token when exists one for this user', async () => {
    const email = 'test@butterfy.me';

    await request(app).post('/user').send({
      email: email,
      username: 'admin1',
      password: 'password',
    });

    await request(app).post('/recovery-password').send({
      email: email
    });

    const resetTokenRepository = dataSource.getRepository(ResetTokenEntity);
    const result = await resetTokenRepository.findAndCount();
    const oldToken = result[0][0];

    await request(app).post('/recovery-password').send({
      email: email
    });

    const result2 = await resetTokenRepository.findAndCount();
    const newToken = result2[0][0];

    const total = result[1];
    expect(total).toEqual(1);
    expect(oldToken.userId).toEqual(newToken.userId);
    expect(oldToken.token).not.toEqual(newToken.token);
    expect(oldToken.createdAt).not.toEqual(newToken.createdAt);
  });

});