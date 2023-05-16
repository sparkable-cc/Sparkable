import { describe, expect, test } from '@jest/globals';
import dataSource from '../../data-source';
import { LinkRepositoryPG } from '../../contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { VoteRepositoryPG } from '../../contexts/voting/infrastructure/persistence/repositories/VoteRepositoryPG';
import { IncreaseStageOnLinksAndUsersAction } from '../../contexts/stages/actions/IncreaseStageOnLinksAndUsersAction';
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

describe('Increase stage on links and users in JOB', () => {
  let increaseStageOnLinksAndUsersAction: IncreaseStageOnLinksAndUsersAction;
  let voteRepository: VoteRepository;
  let linkRepository: LinkRepository;
  let userRepository: UserRepository;
  let stageMovementRepository: StageMovementRepository;

  beforeAll(async () => {
    await dataSource.initialize();
  });

  beforeEach(async () => {
    voteRepository = new VoteRepositoryPG(dataSource);
    linkRepository = new LinkRepositoryPG(dataSource);
    userRepository = new UserRepositoryPG(dataSource);
    stageMovementRepository = new StageMovementRepositoryPG(dataSource);
    increaseStageOnLinksAndUsersAction = new IncreaseStageOnLinksAndUsersAction(
      voteRepository,
      linkRepository,
      userRepository,
      stageMovementRepository
    );
  });

  afterEach(async () => {
    const linkRepository = dataSource.getRepository(LinkEntity);
    await linkRepository.delete({});

    const voteRepository = dataSource.getRepository(VoteEntity);
    await voteRepository.delete({});
  });

  test('increase stage on multiple links and users', async () => {
    const user = await UserFactory.create();
    const user2 = await UserFactory.create();
    const user3 = await UserFactory.create();

    const linkDto = await LinkFactory.create();
    const linkDto2 = await LinkFactory.create();
    const linkDto3 = await LinkFactory.create();

    await voteRepository.storeVote(new Vote({
      userUuid: user2.uuid,
      linkUuid: linkDto.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1,
      date: new Date(2023, 3, 6)
    }));
    await voteRepository.storeVote(new Vote({
      userUuid: user3.uuid,
      linkUuid: linkDto3.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1,
      date: new Date(2023, 3, 6)
    }));

    await increaseStageOnLinksAndUsersAction.execute(new Date(2023, 3, 11));

    const sort = '-date';
    const [links, totalLinks] = await linkRepository.getAllLinks(sort);
    expect(totalLinks).toEqual(3);
    expect(links?.[0].uuid).toEqual(linkDto3.uuid);
    expect(links?.[0].stage).toEqual(2);
    expect(links?.[1].uuid).toEqual(linkDto2.uuid);
    expect(links?.[1].stage).toEqual(1);
    expect(links?.[2].uuid).toEqual(linkDto.uuid);
    expect(links?.[2].stage).toEqual(2);

    const userDto = await userRepository.findUser({uuid: user.uuid});
    expect(userDto?.stage).toEqual(1);
    const userDto2 = await userRepository.findUser({uuid: user2.uuid});
    expect(userDto2?.stage).toEqual(2);
    const userDto3 = await userRepository.findUser({uuid: user3.uuid});
    expect(userDto3?.stage).toEqual(2);
  });

});