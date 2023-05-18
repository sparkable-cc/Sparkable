import request from 'supertest';
import app from '../../app';
import dataSource from '../../data-source';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import LinkFactory from '../../factories/LinkFactory';
import UserFactory from '../../factories/UserFactory';
import ViewedLinkByUserDataFactory from '../../factories/ViewedLinkByUserDataFactory';
import { ViewedLinkByUserDataEntity } from '../../contexts/links/infrastructure/persistence/entities/ViewedLinkByUserDataEntity';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';

describe('GET /viewed-links-in-current-cycle', () => {
  const endpoint = '/viewed-links-in-current-cycle';
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
    await UserFactory.create({email, password, username});
    auth = await UserFactory.signIn(request, app, email, password);
  });

  afterEach(async () => {
    const viewedLinkByUserDataRepository = dataSource.getRepository(
      ViewedLinkByUserDataEntity
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

  it('returns 400 response when userUuid is missing', async () => {
    const res = await request(app)
      .get(endpoint)
      .auth(auth.body.access_token, { type: 'bearer' });

    expect(res.statusCode).toEqual(400);
  });

  it('returns 200 with empty array when there are links', async () => {
    const res = await request(app)
      .get(endpoint + '?userUuid=123')
      .auth(auth.body.access_token, { type: 'bearer' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('returns 200 with one link when there is one link', async () => {
    const linkDto = await LinkFactory.create();

    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkDto.uuid,
      cycle: 1
    });

    const res = await request(app)
      .get(endpoint + '?userUuid=' + auth.body.uuid)
      .auth(auth.body.access_token, { type: 'bearer' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].uuid).toEqual(linkDto.uuid);
    expect(res.body[0].userUuid).not.toEqual(auth.body.uuid);
  });

  it('returns 200 with multiple links', async () => {
    const linkDto = await LinkFactory.create();
    const linkDto2 = await LinkFactory.create();

    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkDto.uuid,
      cycle: 1
    });
    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkDto2.uuid,
      cycle: 1
    });

    const res = await request(app)
      .get(endpoint + '?userUuid=' + auth.body.uuid)
      .auth(auth.body.access_token, { type: 'bearer' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0].uuid).toEqual(linkDto.uuid);
    expect(res.body[1].uuid).toEqual(linkDto2.uuid);
    expect(res.body[0].userUuid).not.toEqual(auth.body.uuid);
  });

  it('returns 200 with multiple links ignoring user submission', async () => {
    const linkDto = await LinkFactory.create({ userUuid: auth.body.uuid });
    const linkDto2 = await LinkFactory.create();

    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkDto.uuid,
      cycle: 1
    });
    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkDto2.uuid,
      cycle: 1
    });

    const res = await request(app)
      .get(endpoint + '?userUuid=' + auth.body.uuid)
      .auth(auth.body.access_token, { type: 'bearer' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].uuid).toEqual(linkDto2.uuid);
    expect(res.body[0].userUuid).not.toEqual(auth.body.uuid);
  });

  it('returns 200 with multiple links ignoring links voted', async () => {
    const linkDto = await LinkFactory.create();
    const linkDto2 = await LinkFactory.create();

    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkDto.uuid,
      cycle: 1
    });
    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkDto2.uuid,
      cycle: 1,
      voted: true
    });

    const res = await request(app)
      .get(endpoint + '?userUuid=' + auth.body.uuid)
      .auth(auth.body.access_token, { type: 'bearer' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].uuid).toEqual(linkDto.uuid);
  });


});