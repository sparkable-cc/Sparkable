import request from 'supertest';
import app from '../../app';
import { CategoryEntity } from '../../contexts/links/infrastructure/persistence/entities/CategoryEntity';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { LinkRepositoryPG } from '../../contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import dataSource from '../../data-source';
import CategoryFactory from '../../factories/CategoryFactory';
import UserFactory from '../../factories/UserFactory';


describe('POST /links', () => {
  let auth: { body: { access_token: string; uuid: string; } };
  let username: string;

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    const email = 'admin@butterfy.me';
    const password = 'password';
    username = 'admin';
    await UserFactory.create({email, password, username});
    auth = await UserFactory.signIn(request, app, email, password);
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(LinkEntity);
    await repository.delete({});

    const categoryRepository = dataSource.getRepository(CategoryEntity);
    await categoryRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.delete({});
  });

  it('returns 401 when the user is not logged to create link', async () => {
    const res = await request(app).post('/links').send({});

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 when the mandatory field is empty creating link', async () => {
    const res = await request(app)
      .post('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Bad request');
  });

  it('returns 400 when the category limit is reached creating link', async () => {
    const res = await request(app)
      .post('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        title: 'title',
        url: 'http://example',
        categories: [
          {id:1, name:'name', slug:'name'},
          {id:2, name:'name2', slug:'name2'},
          {id:3, name:'name3', slug:'name3'}
        ],
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Category limit restriction!');
  });

  it('returns 400 when the category does not exist', async () => {
    const res = await request(app)
      .post('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        title: 'title',
        url: 'http://example',
        categories: [
          {id:1, name:'name', slug:'name'}
        ],
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Category not found!');
  });

  it('returns 403 when link exist', async () => {
    const category = await CategoryFactory.create('Environment', 'environment');

    await request(app)
      .post('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        title: 'title',
        url: 'http://example',
        categories: [category]
      });

    const res = await request(app)
      .post('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        title: 'title2',
        url: 'http://example',
        categories: [category]
      });

    expect(res.statusCode).toEqual(403);
  });

  it('returns 201 when the link is created with the mandatory fields', async () => {
    const title = 'title';
    const url = 'http://example2';
    const category = await CategoryFactory.create('name', 'slug');

    const res = await request(app)
      .post('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        title: title,
        url: url,
        categories: [category]
      });

    expect(res.statusCode).toEqual(201);
    const linkRepository = new LinkRepositoryPG(dataSource);
    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links[0].uuid).not.toBeNull();
    expect(links[0].date).not.toBeNull();
    expect(links[0].title).toEqual(title);
    expect(links[0].url).toEqual(url);
    expect(links[0].userUuid).toEqual(auth.body.uuid);
    expect(links[0].username).toEqual(username);
  });

  it('returns 201 when the link is created with all the fields', async () => {
    const title = 'title';
    const url = 'http://example';
    const image = 'http://image';
    const description = 'description';
    const category = await CategoryFactory.create('name', 'slug');
    const statement = 'Lorem ipsum...';
    const suggestionCategory = 'Sports';

    const res = await request(app)
      .post('/links')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        title: title,
        url: url,
        categories: [category],
        image: image,
        description: description,
        statement: statement,
        suggestionCategory: suggestionCategory
      });

    expect(res.statusCode).toEqual(201);
    const linkRepository = new LinkRepositoryPG(dataSource);
    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links[0].image).toEqual(image);
    expect(links[0].description).toEqual(description);
    expect(links[0].statement).toEqual(statement);
    expect(links[0].suggestionCategory).toEqual(suggestionCategory);
    expect(links[0].userUuid).toEqual(auth.body.uuid);
  });

});