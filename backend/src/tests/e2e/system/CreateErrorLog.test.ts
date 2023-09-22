import request from 'supertest';
import app from '../../../app';
import dataSource from '../../../data-source';
import { ErrorLogEntity } from '../../../contexts/system/infrastructure/persistence/entities/ErrorLogEntity';

const urlEndpoint = '/error-log';

describe('POST /error-log', () => {

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(ErrorLogEntity);
    await repository.clear();
  });

  it('returns 400 when the mandatory fields is empty creating error log', async () => {
    const req = await request(app).post(urlEndpoint).send({});

    expect(req.statusCode).toEqual(400);
  });

  it('returns 201 when the error is created with mandatory fields', async () => {
    const message = 'message';
    const url = 'url';

    const req = await request(app).post(urlEndpoint).send({
      message: message,
      url: url
    });

    expect(req.statusCode).toEqual(201);
    expect(req.body.message).toEqual('Error created!');

    const repository = dataSource.getRepository(ErrorLogEntity);
    const [errors, total] = await repository.findAndCount();
    expect(total).toEqual(1);
    expect(errors[0].message).toEqual(message);
    expect(errors[0].url).toEqual(url);
  });

  it('returns 201 when the error is created with optional fields', async () => {
    const userUuid = 'userUuid';

    const req = await request(app).post(urlEndpoint).send({
      message: 'message',
      url: 'url',
      userUuid: userUuid
    });

    expect(req.statusCode).toEqual(201);
    expect(req.body.message).toEqual('Error created!');

    const repository = dataSource.getRepository(ErrorLogEntity);
    const [errors, total] = await repository.findAndCount();
    expect(total).toEqual(1);
    expect(errors[0].userUuid).toEqual(userUuid);
  });

});