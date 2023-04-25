import { describe, expect, test } from '@jest/globals';
import { link } from 'fs';
import LinkFactory from '../../../factories/LinkFactory';
import { Link } from '../../links/domain/models/Link';
import { LinkRepository } from '../../links/domain/repositories/LinkRepository';
import { LinkRepositoryInMemory } from '../../links/infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { Vote } from '../../voting/domain/models/Vote';
import { VoteRepository } from '../../voting/domain/repositories/VoteRepository';
import { VoteRepositoryInMemory } from '../../voting/infrastructure/persistence/repositories/VoteRepositoryInMemory';
import { NoVotesOnThisCycleException } from '../domain/exceptions/NoVotesOnThisCycleException';
import { IncreaseStageOnLinksAction } from './IncreaseStageOnLinksAction';

describe('Increase stage on links action', () => {
  let increaseStageOnLinksAction: IncreaseStageOnLinksAction;
  let voteRepository: VoteRepository;
  let linkRepository: LinkRepository;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    voteRepository = new VoteRepositoryInMemory();
    linkRepository = new LinkRepositoryInMemory();
    increaseStageOnLinksAction = new IncreaseStageOnLinksAction(
      voteRepository,
      linkRepository
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


  //E2E
  //test('cant increase stage on links when there are no votes in this cycle', async () => {

});