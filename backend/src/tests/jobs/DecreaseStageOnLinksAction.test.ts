import { describe, expect, test } from '@jest/globals';
import dataSource from '../../data-source';
import { LinkRepositoryPG } from '../../contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { VoteRepositoryPG } from '../../contexts/voting/infrastructure/persistence/repositories/VoteRepositoryPG';
import { DecreaseStageOnLinksAndUsersAction } from '../../contexts/stages/actions/DecreaseStageOnLinksAndUsersAction';
import { VoteRepository } from '../../contexts/voting/domain/repositories/VoteRepository';
import { LinkRepository } from '../../contexts/links/domain/repositories/LinkRepository';
import LinkFactory from '../../factories/LinkFactory';
import UserFactory from '../../factories/UserFactory';
import { Vote } from '../../contexts/voting/domain/models/Vote';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { VoteEntity } from '../../contexts/voting/infrastructure/persistence/entities/VoteEntity';
import { UserRepository } from '../../contexts/users/domain/repositories/UserRepository';
import { UserRepositoryPG } from '../../contexts/users/infrastructure/persistence/repositories/UserRepositoryPG';
import { StageMovementRepository } from '../../contexts/stages/domain/repositories/StageMovementRepository';
import { StageMovementRepositoryPG } from '../../contexts/stages/infrastructure/persistence/repositories/StageMovementsLinksRepositoryPG';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { StageMovementEntity } from '../../contexts/stages/infrastructure/persistence/entities/StageMovementEntity';

describe('Decrease stage on links and users in JOB', () => {
  let decreaseStageOnLinksAndUsersAction: DecreaseStageOnLinksAndUsersAction;
  let voteRepository: VoteRepository;
  let linkRepository: LinkRepository;
  let userRepository: UserRepository;
  let stageMovementRepository: StageMovementRepository;

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    voteRepository = new VoteRepositoryPG(dataSource);
    linkRepository = new LinkRepositoryPG(dataSource);
    userRepository = new UserRepositoryPG(dataSource);
    stageMovementRepository = new StageMovementRepositoryPG(dataSource);
    decreaseStageOnLinksAndUsersAction = new DecreaseStageOnLinksAndUsersAction(
      voteRepository,
      linkRepository,
      userRepository,
      stageMovementRepository
    );
  });

  afterEach(async () => {
    const stageMovementRepository = dataSource.getRepository(StageMovementEntity);
    await stageMovementRepository.delete({});

    const voteRepository = dataSource.getRepository(VoteEntity);
    await voteRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.delete({});

    const linkRepository = dataSource.getRepository(LinkEntity);
    await linkRepository.delete({});
  });

  test('not decrease stage on links and users when there are not users and links', async () => {
    await decreaseStageOnLinksAndUsersAction.execute(new Date(2023, 3, 11));

    const [links, totalLinks] = await linkRepository.getAllLinks();
    expect(totalLinks).toEqual(0);

    const [users, totalUsers] = await userRepository.getAllUsers({});
    expect(totalUsers).toEqual(0);

    const [stageMovementCollection, total] = await stageMovementRepository.getAllStageMovement();
    expect(total).toEqual(0);
  });

  test('not decrease stage on links and users when all users and links are stage one', async () => {
    const user = await UserFactory.create({stage:1});
    const linkDto = await LinkFactory.create({stage:1});

    await decreaseStageOnLinksAndUsersAction.execute(new Date(2023, 3, 11));

    const [links, totalLinks] = await linkRepository.getAllLinks();
    expect(totalLinks).toEqual(1);
    expect(links?.[0].uuid).toEqual(linkDto.uuid);
    expect(links?.[0].stage).toEqual(1);

    const userDto = await userRepository.findUser({uuid: user.uuid});
    expect(userDto?.stage).toEqual(1);

    const [stageMovementCollection, total] = await stageMovementRepository.getAllStageMovement();
    expect(total).toEqual(0);
  });

  test('decrease stage on one link and one user', async () => {
    const user = await UserFactory.create({stage:2});
    const linkDto = await LinkFactory.create({stage:2});

    await decreaseStageOnLinksAndUsersAction.execute(new Date(2023, 3, 11));

    const [links, totalLinks] = await linkRepository.getAllLinks();
    expect(totalLinks).toEqual(1);
    expect(links?.[0].uuid).toEqual(linkDto.uuid);
    expect(links?.[0].stage).toEqual(1);

    const userDto = await userRepository.findUser({uuid: user.uuid});
    expect(userDto?.stage).toEqual(1);

    const [stageMovementCollection, total] = await stageMovementRepository.getAllStageMovement();
    expect(total).toEqual(2);
    expect(stageMovementCollection?.[0].linkUuid).toEqual(linkDto.uuid);
    expect(stageMovementCollection?.[0].userUuid).toEqual('');
    expect(stageMovementCollection?.[0].oldStage).toEqual(2);
    expect(stageMovementCollection?.[0].newStage).toEqual(1);
    expect(stageMovementCollection?.[0].cycle).toEqual(1);
    expect(stageMovementCollection?.[1].linkUuid).toEqual('');
    expect(stageMovementCollection?.[1].userUuid).toEqual(user.uuid);
    expect(stageMovementCollection?.[1].oldStage).toEqual(2);
    expect(stageMovementCollection?.[1].newStage).toEqual(1);
    expect(stageMovementCollection?.[1].cycle).toEqual(1);
  });

  test('decrease stage on multiple links and users', async () => {
    const user = await UserFactory.create({stage:2});
    const user2 = await UserFactory.create({stage:2});
    const user3 = await UserFactory.create({stage:2});

    const linkDto = await LinkFactory.create({stage:2});
    const linkDto2 = await LinkFactory.create({stage:2});
    const linkDto3 = await LinkFactory.create({stage:2});

    await voteRepository.storeVote(new Vote({
      userUuid: user2.uuid,
      linkUuid: linkDto2.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1,
      date: new Date(2023, 3, 6)
    }));

    await decreaseStageOnLinksAndUsersAction.execute(new Date(2023, 3, 11));

    const sort = '-date';
    const [links, totalLinks] = await linkRepository.getAllLinks(sort);
    expect(totalLinks).toEqual(3);
    expect(links?.[0].uuid).toEqual(linkDto3.uuid);
    expect(links?.[0].stage).toEqual(1);
    expect(links?.[1].uuid).toEqual(linkDto2.uuid);
    expect(links?.[1].stage).toEqual(2);
    expect(links?.[2].uuid).toEqual(linkDto.uuid);
    expect(links?.[2].stage).toEqual(1);

    const [users, totalUsers] = await userRepository.getAllUsers({});
    expect(totalUsers).toEqual(3);

    expect(users?.[0].uuid).toEqual(user2.uuid);
    expect(users?.[0].stage).toEqual(2);
    expect(users?.[1].uuid).toEqual(user.uuid);
    expect(users?.[1].stage).toEqual(1);
    expect(users?.[2].uuid).toEqual(user3.uuid);
    expect(users?.[2].stage).toEqual(1);

    const [stageMovementCollection, total] = await stageMovementRepository.getAllStageMovement();
    expect(total).toEqual(4);

    console.log(stageMovementCollection);
    console.log(linkDto);

    expect(stageMovementCollection?.[0].linkUuid).toEqual(linkDto.uuid);
    expect(stageMovementCollection?.[0].userUuid).toEqual('');
    expect(stageMovementCollection?.[0].oldStage).toEqual(2);
    expect(stageMovementCollection?.[0].newStage).toEqual(1);
    expect(stageMovementCollection?.[0].cycle).toEqual(1);
    expect(stageMovementCollection?.[1].linkUuid).toEqual(linkDto3.uuid);
    expect(stageMovementCollection?.[1].userUuid).toEqual('');
    expect(stageMovementCollection?.[1].oldStage).toEqual(2);
    expect(stageMovementCollection?.[1].newStage).toEqual(1);
    expect(stageMovementCollection?.[1].cycle).toEqual(1);

    // expect(stageMovementCollection?.[1].linkUuid).toEqual('');
    // expect(stageMovementCollection?.[1].userUuid).toEqual(user.uuid);
    // expect(stageMovementCollection?.[1].oldStage).toEqual(2);
    // expect(stageMovementCollection?.[1].newStage).toEqual(1);
    // expect(stageMovementCollection?.[1].cycle).toEqual(1);
    // expect(stageMovementCollection?.[2].linkUuid).toEqual(linkDto3.uuid);
    // expect(stageMovementCollection?.[2].userUuid).toEqual('');
    // expect(stageMovementCollection?.[2].oldStage).toEqual(2);
    // expect(stageMovementCollection?.[2].newStage).toEqual(1);
    // expect(stageMovementCollection?.[2].cycle).toEqual(1);
    // expect(stageMovementCollection?.[3].linkUuid).toEqual('');
    // expect(stageMovementCollection?.[3].userUuid).toEqual(user3.uuid);
    // expect(stageMovementCollection?.[3].oldStage).toEqual(2);
    // expect(stageMovementCollection?.[3].newStage).toEqual(1);
    // expect(stageMovementCollection?.[3].cycle).toEqual(1);
  });

});