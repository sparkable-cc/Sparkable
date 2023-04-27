import { describe, expect, test } from '@jest/globals';
import dataSource from '../../data-source';
import { LinkRepositoryPG } from '../../contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { VoteRepositoryPG } from '../../contexts/voting/infrastructure/persistence/repositories/VoteRepositoryPG';
import { IncreaseStageOnLinksAction } from '../../contexts/stages/actions/IncreaseStageOnLinksAction';
import { VoteRepository } from '../../contexts/voting/domain/repositories/VoteRepository';
import { LinkRepository } from '../../contexts/links/domain/repositories/LinkRepository';
import LinkFactory from '../../factories/LinkFactory';
import { Vote } from '../../contexts/voting/domain/models/Vote';
import { LinkEntity } from '../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { VoteEntity } from '../../contexts/voting/infrastructure/persistence/entities/VoteEntity';

describe('Increase stage on links action JOB', () => {
  let increaseStageOnLinksAction: IncreaseStageOnLinksAction;
  let voteRepository: VoteRepository;
  let linkRepository: LinkRepository;

  beforeAll(async () => {
    await dataSource.initialize();
    jest.setTimeout(60000);
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    voteRepository = new VoteRepositoryPG(dataSource),
    linkRepository = new LinkRepositoryPG(dataSource),
    increaseStageOnLinksAction = new IncreaseStageOnLinksAction(
      voteRepository,
      linkRepository
    );
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(LinkEntity);
    await repository.delete({});

    const voteRepository = dataSource.getRepository(VoteEntity);
    await voteRepository.delete({});
  });

  test('increase stage on multiple links', async () => {
    const linkDto = await LinkFactory.create();
    const linkDto2 = await LinkFactory.create();
    const linkDto3 = await LinkFactory.create();

    voteRepository.storeVote(new Vote({
      userUuid: 'userUuid',
      linkUuid: linkDto.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1
    }));
    voteRepository.storeVote(new Vote({
      userUuid: 'userUuid',
      linkUuid: linkDto3.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1
    }));

    jest.setSystemTime(new Date(2023, 3, 7));
    await increaseStageOnLinksAction.execute();

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(3);
    expect(links?.[0].uuid).toEqual(linkDto.uuid);
    expect(links?.[0].stage).toEqual(2);
    expect(links?.[1].uuid).toEqual(linkDto2.uuid);
    expect(links?.[1].stage).toEqual(1);
    expect(links?.[2].uuid).toEqual(linkDto3.uuid);
    expect(links?.[2].stage).toEqual(2);
  });

});