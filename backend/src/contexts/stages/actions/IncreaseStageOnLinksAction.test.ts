import { describe, expect, test } from '@jest/globals';
import { Link } from '../../links/domain/models/Link';
import { LinkRepository } from '../../links/domain/repositories/LinkRepository';
import { LinkRepositoryInMemory } from '../../links/infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { Vote } from '../../voting/domain/models/Vote';
import { VoteRepository } from '../../voting/domain/repositories/VoteRepository';
import { VoteRepositoryInMemory } from '../../voting/infrastructure/persistence/repositories/VoteRepositoryInMemory';
import { NoVotesOnThisCycleException } from '../domain/exceptions/NoVotesOnThisCycleException';
import { StageMovementsLinksRepository } from '../domain/repositories/StageMovementsLinksRepository';
import { StageMovementsLinksRepositoryInMemory } from '../infrastructure/persistence/repositories/StageMovementsLinksRepositoryInMemory';
import { IncreaseStageOnLinksAction } from './IncreaseStageOnLinksAction';

describe('Increase stage on links action', () => {
  let increaseStageOnLinksAction: IncreaseStageOnLinksAction;
  let voteRepository: VoteRepository;
  let linkRepository: LinkRepository;
  let stageMovementsLinksRepository: StageMovementsLinksRepositoryInMemory;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    voteRepository = new VoteRepositoryInMemory();
    linkRepository = new LinkRepositoryInMemory();
    stageMovementsLinksRepository = new StageMovementsLinksRepositoryInMemory();
    increaseStageOnLinksAction = new IncreaseStageOnLinksAction(
      voteRepository,
      linkRepository,
      stageMovementsLinksRepository
    );
  });

  test('cant increase stage on links when there are no votes', async () => {
    jest.setSystemTime(new Date(2023, 3, 7));
    await expect(increaseStageOnLinksAction.execute()).rejects.toThrow(
      NoVotesOnThisCycleException
    );
  });

  test('increase stage on one link', async () => {
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: 'userUuid'
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    voteRepository.storeVote(new Vote({
      userUuid: 'userUuid',
      linkUuid: link.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1
    }));

    jest.setSystemTime(new Date(2023, 3, 7));
    await increaseStageOnLinksAction.execute();

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links?.[0].stage).toEqual(2);
  });

  test('increase stage on multiple links', async () => {
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: 'userUuid'
    };
    const link = new Link(linkDto);
    const link2 = new Link(linkDto);
    const link3 = new Link(linkDto);
    linkRepository.storeLink(link);
    linkRepository.storeLink(link2);
    linkRepository.storeLink(link3);

    voteRepository.storeVote(new Vote({
      userUuid: 'userUuid',
      linkUuid: link.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1
    }));
    voteRepository.storeVote(new Vote({
      userUuid: 'userUuid',
      linkUuid: link3.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1
    }));

    jest.setSystemTime(new Date(2023, 3, 11));
    await increaseStageOnLinksAction.execute();

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(3);
    expect(links?.[0].uuid).toEqual(link.uuid);
    expect(links?.[0].stage).toEqual(2);
    expect(links?.[1].uuid).toEqual(link2.uuid);
    expect(links?.[1].stage).toEqual(1);
    expect(links?.[2].uuid).toEqual(link3.uuid);
    expect(links?.[2].stage).toEqual(2);

    const stageMovementsLinksCollection = stageMovementsLinksRepository.all();
    expect(stageMovementsLinksCollection.length).toEqual(2);
    expect(stageMovementsLinksCollection[0].linkUuid).toEqual(link.uuid);
    expect(stageMovementsLinksCollection[0].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[0].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[0].cycle).toEqual(1);
    expect(stageMovementsLinksCollection[1].linkUuid).toEqual(link3.uuid);
    expect(stageMovementsLinksCollection[1].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[1].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[1].cycle).toEqual(1);
  });

  test('save only one movement in one link with multiple votes', async () => {
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: 'userUuid'
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    voteRepository.storeVote(new Vote({
      userUuid: 'userUuid',
      linkUuid: link.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1
    }));
    voteRepository.storeVote(new Vote({
      userUuid: 'userUuid2',
      linkUuid: link.uuid,
      cycle: 1,
      userStage: 1,
      linkStage: 1
    }));

    jest.setSystemTime(new Date(2023, 3, 11));
    await increaseStageOnLinksAction.execute();

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links?.[0].uuid).toEqual(link.uuid);
    expect(links?.[0].stage).toEqual(2);

    const stageMovementsLinksCollection = stageMovementsLinksRepository.all();
    expect(stageMovementsLinksCollection.length).toEqual(1);
    expect(stageMovementsLinksCollection[0].linkUuid).toEqual(link.uuid);
    expect(stageMovementsLinksCollection[0].oldStage).toEqual(1);
    expect(stageMovementsLinksCollection[0].newStage).toEqual(2);
    expect(stageMovementsLinksCollection[0].cycle).toEqual(1);
  });

});