import { ViewedLinkByUserData } from "../../links/domain/models/ViewedLinkByUserData";
import { ViewedLinkByUserDataRepositoryInMemory } from "../../links/infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory";
import { LinkNotOpenedByUserException } from "../domain/exceptions/LinkNotOpenedByUserException";
import { NumberOfVotesExceededException } from "../domain/exceptions/NumberOfVotesExceededException";
import { UserHasNotOpenedAnyLinksException } from "../domain/exceptions/UserHasNotOpenedAnyLinksException";
import { VoteRepositoryInMemory } from "../infrastructure/persistence/repositories/VoteRepositoryInMemory";
import { CreateVoteAction } from "./CreateVoteAction";

describe('Create vote action', () => {

  test('Cant vote when a user has not opened any link', async () => {
    const createVoteAction = new CreateVoteAction(
      new ViewedLinkByUserDataRepositoryInMemory(),
      new VoteRepositoryInMemory()
    );
    const userUuid = 'xxxx';

    await expect(createVoteAction.execute(userUuid, [], 1)).rejects.toThrow(
      UserHasNotOpenedAnyLinksException
    );
  });

  test('Voting with an empty selection', async () => {
    const viewedLinkByUserDataRepository = new ViewedLinkByUserDataRepositoryInMemory();
    const voteRepository = new VoteRepositoryInMemory();

    const userUuid = 'xxxx';
    viewedLinkByUserDataRepository.store(new ViewedLinkByUserData(userUuid, 'linkUuid'));

    const createVoteAction = new CreateVoteAction(
      viewedLinkByUserDataRepository,
      voteRepository
    );

    const cycle = 1;
    const votes: any[] = [];

    await createVoteAction.execute(userUuid, votes, cycle);

    const vote = await voteRepository.findVote({
      userUuid: userUuid,
      cycle: cycle
    });

    expect(vote?.userUuid).toEqual(userUuid);
    expect(vote?.cycle).toEqual(1);
    expect(vote?.votes).toEqual(votes);
    expect(vote?.count).toEqual(0);
  });

  test('Cant vote when the link has not opened by user', async () => {
    const viewedLinkByUserDataRepository = new ViewedLinkByUserDataRepositoryInMemory();

    const createVoteAction = new CreateVoteAction(
      viewedLinkByUserDataRepository,
      new VoteRepositoryInMemory()
    );
    const userUuid = 'userUuid';
    const linkUuid = 'linkUuid';
    viewedLinkByUserDataRepository.store(new ViewedLinkByUserData(userUuid, linkUuid));

    const votes = [{linkUuid: linkUuid}, {linkUuid: 'linkUuid2'}];

    await expect(createVoteAction.execute(userUuid, votes, 1)).rejects.toThrow(
      LinkNotOpenedByUserException
    );
  });

  test('Voting with one selection', async () => {
    const viewedLinkByUserDataRepository = new ViewedLinkByUserDataRepositoryInMemory();
    const voteRepository = new VoteRepositoryInMemory();

    const userUuid = 'userUuid';
    const linkUuid = 'linkUuid';
    viewedLinkByUserDataRepository.store(new ViewedLinkByUserData(userUuid, linkUuid));

    const createVoteAction = new CreateVoteAction(
      viewedLinkByUserDataRepository,
      voteRepository
    );

    const cycle = 1;
    const votes = [{linkUuid: linkUuid}];

    await createVoteAction.execute(userUuid, votes, cycle);

    const vote = await voteRepository.findVote({
      userUuid: userUuid,
      cycle: cycle
    });

    expect(vote?.userUuid).toEqual(userUuid);
    expect(vote?.cycle).toEqual(1);
    expect(vote?.votes).toEqual(votes);
    expect(vote?.count).toEqual(1);
  });

  test('Voting with multiple selection', async () => {
    const viewedLinkByUserDataRepository = new ViewedLinkByUserDataRepositoryInMemory();
    const voteRepository = new VoteRepositoryInMemory();

    const userUuid = 'userUuid';
    const linkUuid = 'linkUuid';
    const linkUuidSecond = 'linkUuidSecond';
    viewedLinkByUserDataRepository.store(new ViewedLinkByUserData(userUuid, linkUuid));
    viewedLinkByUserDataRepository.store(new ViewedLinkByUserData(userUuid, linkUuidSecond));

    const createVoteAction = new CreateVoteAction(
      viewedLinkByUserDataRepository,
      voteRepository
    );

    const cycle = 1;
    const votes = [{linkUuid: linkUuid}, {linkUuid: linkUuidSecond}];

    await createVoteAction.execute(userUuid, votes, cycle);

    const votesInDatabase = await voteRepository.getAllVotes();

    expect(votesInDatabase?.[0].userUuid).toEqual(userUuid);
    expect(votesInDatabase?.[0].cycle).toEqual(1);
    expect(votesInDatabase?.[0].votes).toEqual(votes);
    expect(votesInDatabase?.[0].count).toEqual(2);
  });

  test('Cant vote with more than seven votes', async () => {
    const createVoteAction = new CreateVoteAction(
      new ViewedLinkByUserDataRepositoryInMemory(),
      new VoteRepositoryInMemory()
    );

    const votes = [
      {linkUuid: 'linkUuid'},
      {linkUuid: 'linkUuid2'},
      {linkUuid: 'linkUuid3'},
      {linkUuid: 'linkUuid4'},
      {linkUuid: 'linkUuid5'},
      {linkUuid: 'linkUuid6'},
      {linkUuid: 'linkUuid7'},
      {linkUuid: 'linkUuid8'}
    ];

    await expect(createVoteAction.execute('userUuid', votes, 1)).rejects.toThrow(
      NumberOfVotesExceededException
    );
  });

});