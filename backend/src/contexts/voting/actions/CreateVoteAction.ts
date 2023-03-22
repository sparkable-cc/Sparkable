import { ViewedLinkByUserDataRepository } from "../../links/domain/repositories/ViewedLinkByUserDataRepository";
import { UserHasNotOpenedAnyLinksException } from "../domain/exceptions/UserHasNotOpenedAnyLinksException";
import { Vote } from "../domain/models/Vote";
import { VoteRepository } from "../domain/repositories/VoteRepository";

export class CreateVoteAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  voteRepository: VoteRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository,
    voteRepository: VoteRepository
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
  }

  async execute(userUuid: string, votes: Array<any>, cycle: number) {
    await this.checkUserHasOpenedALink(userUuid);

    const vote = new Vote(userUuid, cycle, votes);
  }

  private async checkUserHasOpenedALink(userUuid: string) {
    const viewedLinkByUserData = await this.viewedLinkByUserDataRepository.findData({
      userUuid: userUuid
    });

    if (!viewedLinkByUserData) {
      throw new UserHasNotOpenedAnyLinksException;
    }
  }

}