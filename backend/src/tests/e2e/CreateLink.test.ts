import { link } from 'fs';
import request from 'supertest';
import app from '../../app';
import { CategoryEntity } from '../../contexts/links/infrastructure/persistence/entities/CategoryEntity';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { LinkRepositoryPG } from '../../contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import dataSource from '../../data-source';
import CategoryFactory from '../../factories/CategoryFactory';

describe('POST /links', () => {

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const categoryRepository = dataSource.getRepository(CategoryEntity);
    await categoryRepository.delete({});

    const repository = dataSource.getRepository(LinkEntity);
    await repository.delete({});
  });

  it('returns 400 when the mandatory field is empty', async () => {
    const res = await request(app)
      .post('/links')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Bad request');
  });

  it('returns 400 when the category limit is reached', async () => {
    const res = await request(app)
      .post('/links')
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

  it('returns 403 when link exist', async () => {
    await request(app)
      .post('/links')
      .send({
        title: 'title',
        url: 'http://example',
        categories: [{id:1, name:'name', slug:'name'}],
      });

    const res = await request(app)
      .post('/links')
      .send({
        title: 'title2',
        url: 'http://example',
        categories: [{id:2, name:'name', slug:'name'}],
      });

    expect(res.statusCode).toEqual(403);
  });

  it('returns 201 when the link is created with the mandatory fields', async () => {
    const title = 'title';
    const url = 'http://example';
    const category = await CategoryFactory.create('name', 'slug');

    const categories = [{
      id: category.id,
      name: category.name,
      slug: category.slug
    }];

    const res = await request(app)
      .post('/links')
      .send({
        title: title,
        url: url,
        categories: categories
      });

    expect(res.statusCode).toEqual(201);
    const linkRepository = new LinkRepositoryPG(dataSource);
    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].uuid).not.toBeNull();
    expect(links[0].date).not.toBeNull();
    expect(links[0].title).toEqual(title);
    expect(links[0].url).toEqual(url);
    expect(links[0].categories).toEqual(categories);
  });

});