import request from 'supertest';
import app from '../../app';
import dataSource from '../../data-source';
import { VotingEntity } from '../../contexts/voting/infrastructure/persistence/entities/VotingEntity';

describe('POST /voting-status', () => {
  const endpoint = '/voting-status';

  beforeAll(async() => {
    await dataSource.initialize();
    //jest.useFakeTimers();
  });

  afterAll(async() => {
    //jest.useRealTimers();
    await dataSource.destroy();
  });

  afterEach(async () => {
    const votingRepository = dataSource.getRepository(VotingEntity);
    await votingRepository.delete({});
  });

  it('returns 200 when date is between one cycle in open voting', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({
        date: '2023-04-06 12:00:00'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.openVoting).toBeTruthy();
    expect(res.body.cycle).toEqual(1);
    expect(res.body.nextOpenVotingDate).toEqual('');
    expect(res.body.daysUntilNextVoting).toEqual(0);
    expect(res.body.timeUntilNextVoting).toEqual('');
    expect(res.body.userHasVoted).toBeFalsy();
  });

  it('returns 200 when date is between one cycle in close voting', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({
        date: '2023-03-27 00:00:00'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.openVoting).toBeFalsy();
    expect(res.body.cycle).toEqual(1);
    expect(res.body.nextOpenVotingDate).toEqual('2023-04-06T00:00:00.000Z');
    expect(res.body.daysUntilNextVoting).toEqual(10);
    expect(res.body.timeUntilNextVoting).toEqual('240:00:00');
    expect(res.body.userHasVoted).toBeFalsy();
  });

  it('returns 400 when the date is outside cycles', async () => {
    const res = await request(app)
      .post(endpoint)
      .send({
        date: '2023-03-23 12:02:34'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Date outside of voting cycles');
  });

  it('returns 200 in an open day when user has voted', async () => {
    const userUuid = 'userUuid';
    const votingRepository = dataSource.getRepository(VotingEntity);
    const [voting, total] = await votingRepository.findAndCount();

    const votingEntity = votingRepository.create({
      userUuid: userUuid,
      cycle: 1,
      countVotes: 0,
    });
    await votingRepository.insert(votingEntity);

    const res = await request(app)
      .post(endpoint)
      .send({
        userUuid: userUuid,
        date: '2023-04-06 12:00:00'
      });

    expect(res.body.userHasVoted).toBeTruthy();
  });

});