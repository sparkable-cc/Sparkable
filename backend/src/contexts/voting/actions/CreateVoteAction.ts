import { ViewedLinkByUserDataRepository } from "../../links/domain/repositories/ViewedLinkByUserDataRepository";
import { UserHasNotOpenedAnyLinksException } from "../domain/exceptions/UserHasNotOpenedAnyLinksException";

export class CreateVoteAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
  }

  async execute(userUuid: string, votes: Array<any>) {
    await this.checkUserHasOpenedALink(userUuid);

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