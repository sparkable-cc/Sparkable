import request from 'supertest';
import app from '../../app';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import dataSource from '../../data-source';

describe('POST /signin', () => {
  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(UserEntity);
    await repository.clear();
  });

  it('returns 200 when the user is signed in', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const res = await request(app).post('/signin').send({
      username: 'admin',
      password: 'password',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token_type).toEqual('Bearer');
    expect(res.body).toHaveProperty('access_token');
  });

  it('returns 401 when the username is not correct', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const res = await request(app).post('/signin').send({
      username: 'wrongusername',
      password: 'password',
    });

    expect(res.statusCode).toEqual(401);
  });

  it('returns 401 when the password is not correct', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const res = await request(app).post('/signin').send({
      username: 'admin',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toEqual(401);
  });
});
