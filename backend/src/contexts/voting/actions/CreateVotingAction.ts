import { count } from "console";
import { link } from "fs";
import { LinkUuidDto } from "../../links/domain/models/LinkUuidDto";
import { ViewedLinkByUserData } from "../../links/domain/models/ViewedLinkByUserData";
import { ViewedLinkByUserDataDto } from "../../links/domain/models/ViewedLinkByUserDataDto";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { ViewedLinkByUserDataRepository } from "../../links/domain/repositories/ViewedLinkByUserDataRepository";
import { MandatoryFieldEmptyException } from "../../users/domain/exceptions/MandatoryFieldEmptyException";
import { UserRepository } from "../../users/domain/repositories/UserRepository";
import { LinkNotOpenedByUserException } from "../domain/exceptions/LinkNotOpenedByUserException";
import { NumberOfVotesExceededException } from "../domain/exceptions/NumberOfVotesExceededException";
import { UserHasNotOpenedAnyLinksException } from "../domain/exceptions/UserHasNotOpenedAnyLinksException";
import { Vote } from "../domain/models/Vote";
import { Voting } from "../domain/models/Voting";
import { VoteRepository } from "../domain/repositories/VoteRepository";
import { VotingRepository } from "../domain/repositories/VotingRepository";
import { GetCurrentCycleService } from "../domain/services/GetCurrentCycleService";

export class CreateVotingAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  votingRepository: VotingRepository;
  voteRepository: VoteRepository;
  userRepository: UserRepository;
  linkRepository: LinkRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository,
    votingRepository: VotingRepository,
    voteRepository: VoteRepository,
    userRepository: UserRepository,
    linkRepository: LinkRepository
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
    this.votingRepository = votingRepository;
    this.voteRepository = voteRepository;
    this.userRepository = userRepository;
    this.linkRepository = linkRepository;
  }

  async execute(userUuid: string, votes: Array<LinkUuidDto>) {
    this.userUuidIsNotEmpty(userUuid);
    this.checkNumberOfVotesMaximum(votes);

    const [dataCollection, total] = await this.viewedLinkByUserDataRepository.getAllData({
      userUuid: userUuid,
      voted: false
    });
    await this.checkUserHasOpenedALink(total);
    await this.checkLinksHaveOpened(votes, dataCollection);

    // STORE VOTES

    //REFACTORING SERVICES GET THE USER INSTANCE
    const user = await this.userRepository.findUser({uuid: userUuid});

    const currentCycle = GetCurrentCycleService.execute().cycle;

    let countVotes = 0;
    for (let index = 0; index < votes.length; index++) {
      const vote = votes[index];

      //REFACTORING SERVICES GET THE LINK INSTANCE
      const link = await this.linkRepository.findLink('uuid', vote.linkUuid);

      // console.log(link?.userUuid);
      // console.log(user?.uuid);
      // console.log(link?.userUuid !== user?.uuid);

      //IGNORE VOTE IF YOU ARE THE OWNER
      if (link?.userUuid !== user?.uuid) {
        countVotes++;
        await this.voteRepository.storeVote(
          new Vote({
            userUuid,
            linkUuid: vote.linkUuid,
            cycle: currentCycle,
            userStage: user?.stage || 0,
            linkStage: link?.stage || 0,
          })
        );
      }
    };

    // STORE VOTING
    const voting = new Voting(userUuid, currentCycle, countVotes);
    await this.votingRepository.storeVoting(voting);

    //UPDATES VIEWEDLINKSDATA - TEST E2E
    const votedLinkUuidCollection = votes.map(vote => {
      return vote.linkUuid ;
    });
    dataCollection.forEach(async data => {
      if (votedLinkUuidCollection.includes(data.linkUuid)) {
        await this.viewedLinkByUserDataRepository.store(
          new ViewedLinkByUserData(
            data.userUuid,
            data.linkUuid,
            data.cycle,
            true
          )
        );
      }
    });
  }

  private userUuidIsNotEmpty(userUuid: string) {
    if (!userUuid)
      throw new MandatoryFieldEmptyException();
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