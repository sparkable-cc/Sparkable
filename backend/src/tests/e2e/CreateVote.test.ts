import request from 'supertest';
import app from '../../app';
import { ViewedLinkByUserDataEntity } from '../../contexts/links/infrastructure/persistence/entities/ViewedLinkByUserDataEntity';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { VoteEntity } from '../../contexts/voting/infrastructure/persistence/entities/VoteEntity';
import { VotingEntity } from '../../contexts/voting/infrastructure/persistence/entities/VotingEntity';
import dataSource from '../../data-source';
import UserFactory from '../../factories/UserFactory';
import LinkFactory from '../../factories/LinkFactory';
import ViewedLinkByUserDataFactory from '../../factories/ViewedLinkByUserDataFactory';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';

describe('POST /votes', () => {
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
    await UserFactory.create(request, app, email, password, username);
    auth = await UserFactory.signIn(request, app, email, password);
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(LinkEntity);
    await repository.delete({});

    const voteRepository = dataSource.getRepository(VoteEntity);
    await voteRepository.delete({});

    const votingRepository = dataSource.getRepository(VotingEntity);
    await votingRepository.delete({});

    const dataRepository = dataSource.getRepository(ViewedLinkByUserDataEntity);
    await dataRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.delete({});
  });

  it('returns 401 when the user is not logged', async () => {
    const res = await request(app).post('/votes').send({});

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 when the mandatory field is empty', async () => {
    const res = await request(app)
      .post('/votes')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Bad request');
  });

  it('returns 400 when the number of votes exceeded', async () => {
    const res = await request(app)
      .post('/votes')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        votes: [
          {linkUuid: 'linkUuid'},
          {linkUuid: 'linkUuid2'},
          {linkUuid: 'linkUuid3'},
          {linkUuid: 'linkUuid4'},
          {linkUuid: 'linkUuid5'},
          {linkUuid: 'linkUuid6'},
          {linkUuid: 'linkUuid7'},
          {linkUuid: 'linkUuid8'}
        ]
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Number of votes exceeded');
  });

  it('returns 403 when a user has not opened any link', async () => {
    const res = await request(app)
      .post('/votes')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        votes: [
          {linkUuid: 'linkUuid'}
        ]
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('User has not opened any link');
  });

  it('returns 403 when user try to vote a link has not opened by him', async () => {
    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: 'linkUuid'
    });
    ViewedLinkByUserDataFactory.store({
      userUuid: 'otherUserId',
      linkUuid: 'linkUuid'
    });

    const res = await request(app)
      .post('/votes')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        votes: [
          {linkUuid: 'linkUuid'}, {linkUuid: 'linkUuidSecond'}
        ]
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('User has not opened any of these link');
  });

  it('returns 200 voting with an empty selection', async () => {
    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: 'linkUuid'
    });

    const res = await request(app)
      .post('/votes')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        votes: []
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Voting created!');

    const votingRepository = dataSource.getRepository(VotingEntity);
    const [voting, total] = await votingRepository.findAndCount();
    expect(total).toEqual(1);
    expect(voting[0].userUuid).toEqual(auth.body.uuid);
    expect(voting[0].countVotes).toEqual(0);
    expect(voting[0].cycle).toEqual(1);
  });

  it('returns 200 voting with multiple selection', async () => {
    const linkUuid = 'linkUuid';
    const linkUuidSecond = 'linkUuidSecond';
    LinkFactory.create({ uuid:linkUuid });
    LinkFactory.create({ uuid:linkUuidSecond });
    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkUuid
    });
    ViewedLinkByUserDataFactory.store({
      userUuid: auth.body.uuid,
      linkUuid: linkUuidSecond
    });

    const res = await request(app)
      .post('/votes')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        votes: [
          {linkUuid: linkUuid}, {linkUuid: linkUuidSecond}
        ]
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Voting created!');

    const votingRepository = dataSource.getRepository(VotingEntity);
    const [voting, total] = await votingRepository.findAndCount();
    expect(total).toEqual(1);
    expect(voting[0].userUuid).toEqual(auth.body.uuid);
    expect(voting[0].countVotes).toEqual(2);
    expect(voting[0].cycle).toEqual(1);

    const voteRepository = dataSource.getRepository(VoteEntity);
    const [votes, totalVotes] = await voteRepository.findAndCount();
    expect(totalVotes).toEqual(2);
    expect(votes[0].userUuid).toEqual(auth.body.uuid);
    expect(votes[0].linkUuid).toEqual(linkUuid);
    expect(votes[0].cycle).toEqual(1);
    expect(votes[1].userUuid).toEqual(auth.body.uuid);
    expect(votes[1].linkUuid).toEqual(linkUuidSecond);

    const dataRepository = dataSource.getRepository(ViewedLinkByUserDataEntity);
    const [data, totalData] = await dataRepository.findAndCount();

    expect(totalData).toEqual(2);
    expect(data[0].voted).toEqual(true);
    expect(data[1].voted).toEqual(true);
  });

});