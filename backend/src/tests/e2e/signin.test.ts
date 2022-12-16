import request from 'supertest';
import app from '../../app';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { TestDataSource } from '../../data-source';

describe('POST /signin', () => {
  beforeAll(async () => {
    await TestDataSource.initialize();
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  afterEach(async () => {
    const repository = TestDataSource.getRepository(UserEntity);
    await repository.clear();
  });

  it('returns 200 when the user is signed in', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const req = await request(app).post('/signin').send({
      username: 'admin',
      password: 'password',
    });

    expect(req.statusCode).toEqual(200);
  });

  it('returns 401 when the username is not correct', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const req = await request(app).post('/signin').send({
      username: 'wrongusername',
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

    const req = await request(app).post('/signin').send({
      username: 'admin',
      password: 'wrongpassword',
    });

    expect(req.statusCode).toEqual(401);
  });
});
