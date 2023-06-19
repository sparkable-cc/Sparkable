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
    await repository.delete({});
  });

  it('returns 200 when the user is signed in with username', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const res = await request(app).post('/signin').send({
      password: 'password',
      username: 'admin',
    });

    expect(res.statusCode).toEqual(200);
  });

  it('returns 200 when the user is signed in with email', async () => {
    const username = 'admin';
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: username,
      password: 'password',
    });

    const res = await request(app).post('/signin').send({
      password: 'password',
      email: 'admin@butterfy.me',
    });

    expect(res.statusCode).toEqual(200);
    // expect(res.body.token_type).toEqual('Bearer');
    // expect(res.body).toHaveProperty('access_token');
    expect(res.body.expires_in).not.toEqual(86400);
    expect(new Date(res.body.expires_in)).toBeInstanceOf(Date);
    expect(res.body).toHaveProperty('uuid');
    expect(res.body.username).toEqual(username);
    expect(res.body.stage).toEqual(1);
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

  it('returns 401 when the email is not correct', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const req = await request(app).post('/signin').send({
      email: 'wrongemail',
      password: 'password',
    });

    expect(req.statusCode).toEqual(401);
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
