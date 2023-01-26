import request from 'supertest';
import app from '../../app';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import dataSource from '../../data-source';

describe('POST /link', () => {
  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(LinkEntity);
    await repository.clear();
  });

  it('returns 400 when the mandatory field is empty', async () => {
    const req = await request(app)
      .post('/link')
      .send({
        title: 'title',
        url: 'http://example',
        categories: ['Environment'],
      });

    expect(req.statusCode).toEqual(400);
  });

  it('returns 201 when the link is created', async () => {
    const req = await request(app)
      .post('/link')
      .send({
        title: 'title',
        url: 'http://example',
        categories: ['Environment'],
      });

    expect(req.statusCode).toEqual(201);
  });

  it('returns 403 when one unique field exists with the same value', async () => {
    await request(app)
      .post('/link')
      .send({
        title: 'title',
        url: 'http://example',
        categories: ['Environment'],
      });

    const req = await request(app)
      .post('/link')
      .send({
        title: 'title',
        url: 'http://example',
        categories: ['Environment'],
      });
    expect(req.statusCode).toEqual(403);
  });

  it('returns 403 when the category limit is reached', async () => {
    const req = await request(app)
      .post('/link')
      .send({
        title: 'title',
        url: 'http://example',
        categories: ['Environment', 'Arts', 'Technology'],
      });

    expect(req.statusCode).toEqual(403);
  });
});
