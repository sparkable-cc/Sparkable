import request from 'supertest';
import app from '../../app';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import dataSource from '../../data-source';
import UserFactory from "../../factories/UserFactory"


describe('POST /link-preview', () => {

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

  it('returns 401 when the user is not logged', async () => {
    const res = await request(app).post('/link-preview-data').send({});

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 when the body is empty', async () => {
    const email = 'admin@butterfy.me';
    const password = 'password';
    await UserFactory.create(email, password);
    const auth = await UserFactory.signIn(request, app, email, password);

    const res = await request(app)
    .post('/link-preview-data')
    .auth(auth.body.access_token, { type: 'bearer' })
    .send({});

    expect(res.statusCode).toEqual(400);
  });

  it('returns 200 when the url exists', async () => {
    const email = 'admin@butterfy.me';
    const password = 'password';
    await UserFactory.create(email, password);
    const auth = await UserFactory.signIn(request, app, email, password);
    const url = 'https://ogp.me/';

    const res = await request(app)
      .post('/link-preview-data')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({url: url});

    expect(res.statusCode).toEqual(200);
    expect(res.body.ogUrl).toEqual(url);
    expect(res.body.ogTitle).toEqual('Open Graph protocol');
    expect(res.body).toHaveProperty('ogDescription');
    expect(res.body).toHaveProperty('ogImage');
  });

});