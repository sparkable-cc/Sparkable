import request from 'supertest';
import app from '../../app';
import dataSource from '../../data-source';
import UserFactory from '../../factories/UserFactory';
import LinkFactory from '../../factories/LinkFactory';
import { LinkDto } from '../../contexts/links/domain/models/LinkDto';
import { ViewedLinkByUserDataEntity } from '../../contexts/links/infrastructure/persistence/entities/ViewedLinkByUserDataEntity';
import { CategoryEntity } from '../../contexts/links/infrastructure/persistence/entities/CategoryEntity';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { GetCurrentCycleService } from '../../contexts/voting/domain/services/GetCurrentCycleService';

describe('POST /viewed-link-user', () => {
  const endpoint = '/viewed-link-user';
  let auth: { body: { access_token: string; uuid: string; } };
  let username: string;
  let link: LinkDto;

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
    const user = await UserFactory.create({email, password, username});
    auth = await UserFactory.signIn(user);

    // Create link
    link = await LinkFactory.create();
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(ViewedLinkByUserDataEntity);
    await repository.delete({});

    const categoryRepository = dataSource.getRepository(CategoryEntity);
    await categoryRepository.delete({});

    const linkRepository = dataSource.getRepository(LinkEntity);
    await linkRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.delete({});
  });

  it('returns 401 when the user is not logged', async () => {
    const res = await request(app).post(endpoint).send({});

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 when the mandatory field is empty', async () => {
    const res = await request(app)
      .post(endpoint)
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Bad request');
  });

  it('returns 400 when the user does not exist', async () => {
    const res = await request(app)
      .post(endpoint)
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: 'xxx',
        linkUuid: 'xxx'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('User not found!');
  });

  it('returns 400 when the link does not exist', async () => {
    const res = await request(app)
      .post(endpoint)
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        linkUuid: 'xxx'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Link not found!');
  });

  it('returns 201 when data is created', async () => {
    const res = await request(app)
      .post(endpoint)
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        linkUuid: link.uuid
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Data created!');
    const repository = dataSource.getRepository(ViewedLinkByUserDataEntity);
    const result = await repository.findAndCount();
    expect(result[1]).toEqual(1);
    expect(result[0][0].userUuid).toEqual(auth.body.uuid);
    expect(result[0][0].linkUuid).toEqual(link.uuid);
    expect(result[0][0].date).not.toEqual(null);
    const currentCycle = GetCurrentCycleService.execute();
    expect(result[0][0].cycle).toEqual(currentCycle.cycle);
    expect(result[0][0].userStage).toEqual(1);
    expect(result[0][0].linkStage).toEqual(1);
  });

  it('returns 403 when data exists with the user and the link', async () => {
    await request(app)
      .post(endpoint)
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        linkUuid: link.uuid
      });

    const res = await request(app)
      .post(endpoint)
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        linkUuid: link.uuid
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('Data already exists!');
  });

});