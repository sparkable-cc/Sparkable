import request from 'supertest';
import app from '../../app';

describe('POST /voting-status', () => {
  const endpoint = '/voting-status';

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns 200 when date is between one cycle in open voting', async () => {
    jest.setSystemTime(new Date('2023-04-06 12:00:00'));
    const res = await request(app)
      .post(endpoint);

    expect(res.statusCode).toEqual(200);
    expect(res.body.openVoting).toBeTruthy();
    expect(res.body.cycle).toEqual(1);
    expect(res.body.nextOpenVotingDate).toEqual('');
    expect(res.body.daysUntilNextVoting).toEqual(0);
    expect(res.body.timeUntilNextVoting).toEqual('');
  });

  it('returns 200 when date is between one cycle in close voting', async () => {
    jest.setSystemTime(new Date('2023-03-27 00:00:00'));
    const res = await request(app)
      .post(endpoint);

    expect(res.statusCode).toEqual(200);
    expect(res.body.openVoting).toBeFalsy();
    expect(res.body.cycle).toEqual(1);
    expect(res.body.nextOpenVotingDate).toEqual('2023-04-06T00:00:00.000Z');
    expect(res.body.daysUntilNextVoting).toEqual(10);
    expect(res.body.timeUntilNextVoting).toEqual('240:00:00');
  });

  it('returns 400 when the date is outside cycles', async () => {
    jest.setSystemTime(new Date('2023-03-23 12:02:34'));
    const res = await request(app)
      .post(endpoint);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Date outside of voting cycles');
  });

});