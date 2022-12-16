import request from 'supertest';
import app from '../../app';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { TestDataSource } from '../../data-source';

describe('POST /user', () => {
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

  it('returns 400 when the mandatory field is empty', async () => {
    const req = await request(app).post('/user').send({
      email: '',
      username: 'admin',
      password: 'password',
    });

    expect(req.statusCode).toEqual(400);
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
    let req = await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    req = await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });
    expect(req.statusCode).toEqual(403);
  });
});
