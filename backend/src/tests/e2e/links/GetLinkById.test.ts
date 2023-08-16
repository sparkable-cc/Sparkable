import request from 'supertest';
import app from '../../../app';
import { CategoryEntity } from '../../../contexts/links/infrastructure/persistence/entities/CategoryEntity';
import { LinkEntity } from '../../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import dataSource from '../../../data-source';
import CategoryFactory from '../../../factories/CategoryFactory';
import LinkFactory from '../../../factories/LinkFactory';

describe('GET /links/:id', () => {
  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const linkRepository = dataSource.getRepository(LinkEntity);
    await linkRepository.delete({});

    const categoryRepository = dataSource.getRepository(CategoryEntity);
    await categoryRepository.delete({});
  });

  it('returns 400 when does not exists link', async () => {
    const res = await request(app).get('/links/1');

    expect(res.statusCode).toEqual(400);
  });

  it('returns 200 with link when exists', async () => {
    const link = await LinkFactory.create();

    const res = await request(app).get('/links/' + link.id);

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(link.id);
    expect(res.body.title).toEqual(link.title);
    expect(res.body.description).toEqual(link.description);
  });
});
