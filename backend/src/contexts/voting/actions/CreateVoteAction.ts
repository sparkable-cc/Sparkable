import { ViewedLinkByUserDataDto } from "../../links/domain/models/ViewedLinkByUserDataDto";
import { ViewedLinkByUserDataRepository } from "../../links/domain/repositories/ViewedLinkByUserDataRepository";
import { LinkNotOpenedByUserException } from "../domain/exceptions/LinkNotOpenedByUserException";
import { NumberOfVotesExceededException } from "../domain/exceptions/NumberOfVotesExceededException";
import { UserHasNotOpenedAnyLinksException } from "../domain/exceptions/UserHasNotOpenedAnyLinksException";
import { Voting } from "../domain/models/Voting";
import { VoteRepository } from "../domain/repositories/VoteRepository";

export class CreateVoteAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  voteRepository: VoteRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository,
    voteRepository: VoteRepository
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
    this.voteRepository = voteRepository;
  }

  async execute(userUuid: string, votes: Array<any>, cycle: number) {
    this.checkNumberOfVotesMaximum(votes);

    const [dataCollection, total] = await this.viewedLinkByUserDataRepository.getAllData({
      userUuid: userUuid,
      cycle: cycle
    });
    await this.checkUserHasOpenedALink(total);
    await this.checkLinksHaveOpened(votes, dataCollection);

    const vote = new Voting(userUuid, cycle, votes);

    await this.voteRepository.storeVote(vote);
  }

  private checkNumberOfVotesMaximum(votes: any[]) {
    if (votes.length > 7) {
      throw new NumberOfVotesExceededException;
    }
  }

  private async checkUserHasOpenedALink(total: number) {
    if (!total) {
      throw new UserHasNotOpenedAnyLinksException;
    }
  }

  private async checkLinksHaveOpened(votes: Array<any>, dataCollection: Array<ViewedLinkByUserDataDto>) {
    const linkUuidCollection = dataCollection.map(data => {
      return data.linkUuid ;
    });

    votes.forEach(vote => {
      if (!linkUuidCollection.includes(vote.linkUuid)) {
        throw new LinkNotOpenedByUserException;
      }
    });
  }

}