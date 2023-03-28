import request from 'supertest';
import app from '../../app';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { ViewedLinkByUserDataEntity } from '../../contexts/links/infrastructure/persistence/entities/ViewedLinkByUserDataEntity';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import dataSource from '../../data-source';
import LinkFactory from '../../factories/LinkFactory';
import UserFactory from '../../factories/UserFactory';

describe('/viewed-links-user', () => {
  const endpoint = '/viewed-link-user';
  let auth: { body: { access_token: string; uuid: string } };
  let username: string;

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Create user and login
    const email = 'admin@butterfy.me';
    const password = 'password';
    username = 'admin';
    await UserFactory.create(request, app, email, password, username);
    auth = await UserFactory.signIn(request, app, email, password);
  });

  afterEach(async () => {
    const viewedLinkByUserDataRepository = dataSource.getRepository(
      ViewedLinkByUserDataEntity,
    );
    await viewedLinkByUserDataRepository.delete({});

    const linkRepository = dataSource.getRepository(LinkEntity);
    await linkRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.delete({});
  });

  it('returns 401 when the user is not logged', async () => {
    const res = await request(app).get(endpoint);

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 response when link stage is missing', async () => {
    const res = await request(app)
      .get('/viewed-link-user?userUuid=123')
      .auth(auth.body.access_token, { type: 'bearer' });

    expect(res.statusCode).toEqual(400);
  });

  it('returns 200 with empty array when there is no link', async () => {
    const res = await request(app)
      .get('/viewed-link-user?userUuid=123&linkUuid=123&stage=1')
      .auth(auth.body.access_token, { type: 'bearer' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('returns 200 with one link when there is one link', async () => {
    const linkDto = await LinkFactory.create();
    const res = await request(app).get(
      '/get-all-my-viewed-links?userUuid=123&stage=1',
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it('returns 200 with more than one links when there is link', async () => {
    await LinkFactory.create();
    await LinkFactory.create();
    const res = await request(app).get(
      '/get-all-my-viewed-links?userUuid=123&stage=1',
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });
});

// returns 400 response when link stage is missing from get all my viewed links
// returns 200 with empty array when there is no link
// returns 200 with one link when there is one link
// returns 200 with more than one links when there is link
