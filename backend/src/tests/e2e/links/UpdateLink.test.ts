import request from 'supertest';
import app from '../../../app';
import dataSource from '../../../data-source';
import UserFactory from '../../../factories/UserFactory';
import LinkFactory from '../../../factories/LinkFactory';
import { UserEntity } from '../../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { LinkEntity } from '../../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { LinkRepositoryPG } from '../../../contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';

describe('PUT /links', () => {
  let auth: { body: { access_token: string; uuid: string; } };

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    const email = 'admin@butterfy.me';
    const password = 'password';
    const username = 'admin';
    await UserFactory.create({email, password, username});
    auth = await UserFactory.signIn(request, app, email, password);
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(LinkEntity);
    await repository.delete({});

    // const categoryRepository = dataSource.getRepository(CategoryEntity);
    // await categoryRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.delete({});
  });

  it('returns 401 when the user is not logged to update link', async () => {
    const res = await request(app).put('/links').send({});

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 when the mandatory field is empty updating link', async () => {
    const res = await request(app)
      .put('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Bad request');
  });

  it('returns 403 when the user is not the owner of the link', async () => {
    const res = await request(app)
      .put('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        uuid: 'uuid'
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('Forbidden');
  });

  it('returns 200 when the link is updated', async () => {
    const link = await LinkFactory.create({
      userUuid: auth.body.uuid
    });
    await new Promise((r) => setTimeout(r, 2000));

    const newStatement = 'The new statement!';
    const res = await request(app)
      .put('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        uuid: link.uuid,
        statement: newStatement
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Link updated!');

    const linkRepository = new LinkRepositoryPG(dataSource);
    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links[0].uuid).toEqual(link.uuid);
    expect(links[0].date).toEqual(link.date);
    expect(links[0].statement).toEqual(newStatement);
    expect(links[0].updateDate).not.toEqual(new Date(0));
  });

});