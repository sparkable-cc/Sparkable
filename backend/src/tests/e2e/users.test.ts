import request from 'supertest';
import app from '../../app';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import dataSource from '../../data-source';

describe('POST /user', () => {
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

  it('returns 400 when the mandatory field is empty', async () => {
    const req = await request(app).post('/user').send({
      email: '',
      username: 'admin',
      password: 'password',
    });

    expect(req.statusCode).toEqual(400);
  });

  it('returns 400 when the password is less than 8 characters', async () => {
    const req = await request(app).post('/user').send({
      email: '',
      username: 'admin',
      password: 'pass',
    });

    expect(req.statusCode).toEqual(400);
    expect(req.body.message).toEqual('Password is too short!');
  });

  it('returns 201 when the user is created', async () => {
    const req = await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    expect(req.statusCode).toEqual(201);
  });

  it('returns 403 when one unique field exists with the same value', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const req = await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });
    expect(req.statusCode).toEqual(403);
  });
});
