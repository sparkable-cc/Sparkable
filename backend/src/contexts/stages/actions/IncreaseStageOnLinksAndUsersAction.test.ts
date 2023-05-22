import { describe, expect, test } from '@jest/globals';
import { Link } from '../../links/domain/models/Link';
import { LinkRepository } from '../../links/domain/repositories/LinkRepository';
import { LinkRepositoryInMemory } from '../../links/infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { User } from '../../users/domain/models/User';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { UserRepositoryInMemory } from '../../users/infrastructure/persistence/repositories/UserRepositoryInMemory';
import { Vote } from '../../voting/domain/models/Vote';
import { VoteRepository } from '../../voting/domain/repositories/VoteRepository';
import { VoteRepositoryInMemory } from '../../voting/infrastructure/persistence/repositories/VoteRepositoryInMemory';
import { NoVotesOnThisCycleException } from '../domain/exceptions/NoVotesOnThisCycleException';
import { StageMovementRepositoryInMemory } from '../infrastructure/persistence/repositories/StageMovementsLinksRepositoryInMemory';
import { IncreaseStageOnLinksAndUsersAction } from './IncreaseStageOnLinksAndUsersAction';
import { StoreStageMovementService } from '../domain/services/StoreStageMovementService';

describe('Increase stage on links and users action', () => {
  let increaseStageOnLinksAndUsersAction: IncreaseStageOnLinksAndUsersAction;
  let voteRepository: VoteRepository;
  let linkRepository: LinkRepository;
  let userRepository: UserRepository;
  let stageMovementsLinksRepository: StageMovementRepositoryInMemory;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    voteRepository = new VoteRepositoryInMemory();
    linkRepository = new LinkRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    stageMovementsLinksRepository = new StageMovementRepositoryInMemory();
    increaseStageOnLinksAndUsersAction = new IncreaseStageOnLinksAndUsersAction(
      voteRepository,
      linkRepository,
      userRepository,
      stageMovementsLinksRepository,
      new StoreStageMovementService(stageMovementsLinksRepository)
    );
  });

  test('cant increase stage on links when there are no votes', async () => {
    jest.setSystemTime(new Date(2023, 3, 7));
    await expect(increaseStageOnLinksAndUsersAction.execute()).rejects.toThrow(
      NoVotesOnThisCycleException
    );
  });

  test('increase stage in one link and one user', async () => {
    const stageInitial = 1;
    const userUuid = 'userUuid';
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid,
      stage: stageInitial
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    const user = new User(
      'email',
      'username',
      'password',
      userUuid,
      stageInitial
    );
    userRepository.storeUser(user);

    voteRepository.storeVote(new Vote({
      userUuid: userUuid,
      linkUuid: link.uuid,
      cycle: 1,
      userStage: stageInitial,
      linkStage: stageInitial,
      date: new Date(2023, 3, 6)
    }));

    jest.setSystemTime(new Date(2023, 3, 7));
    await increaseStageOnLinksAndUsersAction.execute();

    const [links, totalLinks] = await linkRepository.getAllLinks();
    expect(totalLinks).toEqual(1);
    expect(links?.[0].stage).toEqual(2);

    const userDto = await userRepository.findUser({uuid: userUuid});
    expect(userDto?.stage).toEqual(2);
  });

  test('increase stage on multiple links and one users', async () => {
    const stageInitial = 1;
    const userUuid = 'userUuid';
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid,
      stage: stageInitial
    };
    const link = new Link(linkDto);
    const link2 = new Link(linkDto);
    const link3 = new Link(linkDto);
    linkRepository.storeLink(link);
    linkRepository.storeLink(link2);
    linkRepository.storeLink(link3);

    const user = new User(
      'email',
      'username',
      'password',
      userUuid,
      stageInitial
    );
    userRepository.storeUser(user);

    voteRepository.storeVote(new Vote({
      userUuid: userUuid,
      linkUuid: link.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1,
      date: new Date(2023, 3, 6)
    }));
    voteRepository.storeVote(new Vote({
      userUuid: userUuid,
      linkUuid: link3.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1,
      date: new Date(2023, 3, 6)
    }));

    jest.setSystemTime(new Date(2023, 3, 11));
    await increaseStageOnLinksAndUsersAction.execute();

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(3);
    expect(links?.[0].uuid).toEqual(link.uuid);
    expect(links?.[0].stage).toEqual(2);
    expect(links?.[1].uuid).toEqual(link2.uuid);
    expect(links?.[1].stage).toEqual(1);
    expect(links?.[2].uuid).toEqual(link3.uuid);
    expect(links?.[2].stage).toEqual(2);

    const userDto = await userRepository.findUser({uuid: userUuid});
    expect(userDto?.stage).toEqual(2);

    const stageMovementsLinksCollection = stageMovementsLinksRepository.all();
    expect(stageMovementsLinksCollection.length).toEqual(3);

    expect(stageMovementsLinksCollection[0].linkUuid).toEqual(link.uuid);
    expect(stageMovementsLinksCollection[0].userUuid).toEqual('');
    expect(stageMovementsLinksCollection[0].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[0].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[0].cycle).toEqual(1);

    expect(stageMovementsLinksCollection[1].linkUuid).toEqual('');
    expect(stageMovementsLinksCollection[1].userUuid).toEqual(userUuid);
    expect(stageMovementsLinksCollection[1].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[1].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[1].cycle).toEqual(1);

    expect(stageMovementsLinksCollection[2].linkUuid).toEqual(link3.uuid);
    expect(stageMovementsLinksCollection[2].userUuid).toEqual('');
    expect(stageMovementsLinksCollection[2].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[2].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[2].cycle).toEqual(1);
  });

  test('save only one movement in one link with multiple votes by different users', async () => {
    const userUuid = 'userUuid1';
    const userUuid2 = 'userUuid2';

    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid,
      stage: 1
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    const user = new User(
      'email',
      'username',
      'password',
      userUuid,
      1
    );
    userRepository.storeUser(user);
    const user2 = new User(
      'email',
      'username',
      'password',
      userUuid2,
      1
    );
    userRepository.storeUser(user2);

    voteRepository.storeVote(new Vote({
      userUuid: userUuid,
      linkUuid: link.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1,
      date: new Date(2023, 3, 6)
    }));
    voteRepository.storeVote(new Vote({
      userUuid: userUuid2,
      linkUuid: link.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1,
      date: new Date(2023, 3, 6)
    }));

    jest.setSystemTime(new Date(2023, 3, 11));
    await increaseStageOnLinksAndUsersAction.execute();

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links?.[0].uuid).toEqual(link.uuid);
    expect(links?.[0].stage).toEqual(2);

    const userDto = await userRepository.findUser({uuid: userUuid});
    expect(userDto?.stage).toEqual(2);
    const userDto2 = await userRepository.findUser({uuid: userUuid2});
    expect(userDto2?.stage).toEqual(2);

    const stageMovementsLinksCollection = stageMovementsLinksRepository.all();
    expect(stageMovementsLinksCollection.length).toEqual(3);

    expect(stageMovementsLinksCollection[0].linkUuid).toEqual(link.uuid);
    expect(stageMovementsLinksCollection[0].userUuid).toEqual('');
    expect(stageMovementsLinksCollection[0].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[0].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[0].cycle).toEqual(1);

    expect(stageMovementsLinksCollection[1].linkUuid).toEqual('');
    expect(stageMovementsLinksCollection[1].userUuid).toEqual(userUuid);
    expect(stageMovementsLinksCollection[1].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[1].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[1].cycle).toEqual(1);

    expect(stageMovementsLinksCollection[2].linkUuid).toEqual('');
    expect(stageMovementsLinksCollection[2].userUuid).toEqual(userUuid2);
    expect(stageMovementsLinksCollection[2].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[2].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[2].cycle).toEqual(1);
  });

});