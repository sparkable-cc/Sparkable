import { ViewedLinkByUserDataRepositoryInMemory } from "../../links/infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory";
import { UserHasNotOpenedAnyLinksException } from "../domain/exceptions/UserHasNotOpenedAnyLinksException";
import { CreateVoteAction } from "./CreateVoteAction";

describe('Create vote action', () => {

  test('Cant vote when a user has not opened any link', async () => {
    const createVoteAction = new CreateVoteAction(new ViewedLinkByUserDataRepositoryInMemory());
    const userUuid = 'xxxx';
    const votes: any[] = [];

    expect(createVoteAction.execute(userUuid, votes)).rejects.toThrow(
      UserHasNotOpenedAnyLinksException
    );
  });



});