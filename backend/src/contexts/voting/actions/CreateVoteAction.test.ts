import { ViewedLinkByUserData } from "../../links/domain/models/ViewedLinkByUserData";
import { ViewedLinkByUserDataRepositoryInMemory } from "../../links/infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory";
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

    expect(createVoteAction.execute(userUuid, [], 1)).rejects.toThrow(
      UserHasNotOpenedAnyLinksException
    );
  });

  test('Vote an empty selection', async () => {
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

    createVoteAction.execute(userUuid, votes, cycle);

    const vote = await voteRepository.findVote({
      userUuid: userUuid,
      cycle: cycle
    });

    console.log(vote);

    expect(vote?.userUuid).toEqual(userUuid);
    expect(vote?.cycle).toEqual(1);
    expect(vote?.votes).toEqual(votes);
    expect(vote?.count).toEqual(0);
  });


});