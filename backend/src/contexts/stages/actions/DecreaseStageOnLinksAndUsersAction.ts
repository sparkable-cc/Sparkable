import { Link } from "../../links/domain/models/Link";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { User } from "../../users/domain/models/User";
import { UserRepository } from "../../users/domain/repositories/UserRepository";
import { VoteRepository } from "../../voting/domain/repositories/VoteRepository";
import { GetCurrentCycleService } from "../../voting/domain/services/GetCurrentCycleService";
import { StoreStageMovementService } from "../domain/services/StoreStageMovementService";

export class DecreaseStageOnLinksAndUsersAction {
  voteRepository: VoteRepository;
  linkRepository: LinkRepository;
  userRepository: UserRepository;
  storeStageMovementService: StoreStageMovementService;

  constructor(
    voteRepository: VoteRepository,
    linkRepository: LinkRepository,
    userRepository: UserRepository,
    storeStageMovementService: StoreStageMovementService
  ) {
    this.voteRepository = voteRepository;
    this.linkRepository = linkRepository;
    this.userRepository = userRepository;
    this.storeStageMovementService = storeStageMovementService;
  }

  async execute(currentDate: Date = new Date()) {
    const lastCycle = GetCurrentCycleService.execute(currentDate).cycle - 1;
    const countLinksUpdated = await this.downgradeStageOnLinksWithoutVoted(lastCycle);
    const countUsersUpdated = await this.downgradeStageOnUsersWithoutVotes(lastCycle);
    return [countLinksUpdated, countUsersUpdated];
  }

  private async downgradeStageOnUsersWithoutVotes(lastCycle: number) {
    const [userCollectionOnStageTwo, totalUsers] = await this.userRepository.getAllUsers({ stage: 2 });
    let countLinksUpdated = 0;
    for (let index = 0; index < totalUsers; index++) {
      const [voteCollectionOnThisCycle, totalVotes] = await this.voteRepository.getAllVotes({
        userUuid: userCollectionOnStageTwo[index].uuid,
        cycle: lastCycle
      });

      if (totalVotes === 0) {
        const oldStage = userCollectionOnStageTwo[index].stage;
        const newStage = 1;
        userCollectionOnStageTwo[index].stage = 1;
        await this.userRepository.storeUser(User.factory(userCollectionOnStageTwo[index]));
        await this.storeStageMovementService.execute('', userCollectionOnStageTwo[index].uuid, oldStage, newStage, lastCycle);
        countLinksUpdated++;
      }
    }

    return countLinksUpdated;
  }

  private async downgradeStageOnLinksWithoutVoted(lastCycle:number) {
    const [linkCollectionOnStageTwo, totalLinks] = await this.linkRepository.getAllLinks('-desc', undefined, undefined, 2);
    let countUsersUpdated = 0;
    for (let index = 0; index < totalLinks; index++) {
      const [voteCollectionOnThisCycle, totalVotes] = await this.voteRepository.getAllVotes({
        linkUuid: linkCollectionOnStageTwo[index].uuid,
        cycle: lastCycle
      });

      if (totalVotes === 0) {
        const oldStage = linkCollectionOnStageTwo[index].stage;
        const newStage = 1;
        linkCollectionOnStageTwo[index].stage = 1;
        await this.linkRepository.storeLink(new Link(linkCollectionOnStageTwo[index]));
        await this.storeStageMovementService.execute(linkCollectionOnStageTwo[index].uuid, '', oldStage, newStage, lastCycle);
        countUsersUpdated++;
      }
    }

    return countUsersUpdated;
  }

}