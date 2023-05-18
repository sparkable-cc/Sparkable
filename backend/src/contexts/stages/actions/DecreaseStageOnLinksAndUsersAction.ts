import { Link } from "../../links/domain/models/Link";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { User } from "../../users/domain/models/User";
import { UserRepository } from "../../users/domain/repositories/UserRepository";
import { VoteRepository } from "../../voting/domain/repositories/VoteRepository";
import { GetCurrentCycleService } from "../../voting/domain/services/GetCurrentCycleService";
import { StageMovement } from "../domain/models/StageMovement";
import { StageMovementRepository } from "../domain/repositories/StageMovementRepository";

export class DecreaseStageOnLinksAndUsersAction {
  voteRepository: VoteRepository;
  linkRepository: LinkRepository;
  userRepository: UserRepository;
  stageMovementRepository: StageMovementRepository;

  constructor(
    voteRepository: VoteRepository,
    linkRepository: LinkRepository,
    userRepository: UserRepository,
    stageMovementRepository: StageMovementRepository
  ) {
    this.voteRepository = voteRepository;
    this.linkRepository = linkRepository;
    this.userRepository = userRepository;
    this.stageMovementRepository = stageMovementRepository;
  }

  async execute(currentDate: Date = new Date()) {
    const lastCycle = GetCurrentCycleService.execute(currentDate).cycle - 1;

    // CALCULATE LINKS
    const [linkCollectionOnStageTwo, totalLinks] = await this.linkRepository.getAllLinks(undefined, undefined, undefined, 2);
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
        await this.saveStageMovement(linkCollectionOnStageTwo[index].uuid, '', oldStage, newStage, lastCycle);
      }
    }

    // CALCULATE USERS
    const [userCollectionOnStageTwo, totalUsers] = await this.userRepository.getAllUsers({stage:2});
    for (let index = 0; index < totalLinks; index++) {
      const [voteCollectionOnThisCycle, totalVotes] = await this.voteRepository.getAllVotes({
        userUuid: userCollectionOnStageTwo[index].uuid,
        cycle: lastCycle
      });

      if (totalVotes === 0) {
        const oldStage = userCollectionOnStageTwo[index].stage;
        const newStage = 1;
        userCollectionOnStageTwo[index].stage = 1;
        await this.userRepository.storeUser(User.factory(userCollectionOnStageTwo[index]));
        await this.saveStageMovement('', userCollectionOnStageTwo[index].uuid, oldStage, newStage, lastCycle);
      }
    }
  }

  //REFACTOR A UN SERVICE!!!
  private async saveStageMovement(linkUuid: string, userUuid: string, oldStage: number, newStage: number, lastCycle: number) {
    await this.stageMovementRepository.storeStageMovementLink(
      new StageMovement(
        {
          linkUuid: linkUuid,
          userUuid: userUuid,
          oldStage,
          newStage,
          cycle: lastCycle
        }
      )
    );
  }

}