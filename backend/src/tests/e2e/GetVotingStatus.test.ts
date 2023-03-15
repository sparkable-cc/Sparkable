import request from 'supertest';
import app from '../../app';
import dataSource from '../../data-source';

describe('POST /voting-status', () => {
  const endpoint = '/voting-status';

  it('returns 400 when the mandatory field is empty', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid date!');
  });

  it('returns 400 when the date is not valid', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({ date: 'xxx' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid date!');
  });

  it('returns 200 when date is between one round in open voting', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({
        date: '2023-04-06 12:00:00'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.openVoting).toBeTruthy();
    expect(res.body.round).toEqual(1);
    expect(res.body.nextOpenVotingDate).toEqual('');
    expect(res.body.daysUntilNextVoting).toEqual(0);
    expect(res.body.timeUntilNextVoting).toEqual('');
  });

  it('returns 200 when date is between one round in close voting', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({
        date: '2023-03-27 00:00:00'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.openVoting).toBeFalsy();
    expect(res.body.round).toEqual(1);
    expect(res.body.nextOpenVotingDate).toEqual('2023-04-06T00:00:00.000Z');
    expect(res.body.daysUntilNextVoting).toEqual(10);
    expect(res.body.timeUntilNextVoting).toEqual('240:00:00');
  });

});