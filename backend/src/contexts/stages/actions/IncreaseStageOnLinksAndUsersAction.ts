import { Link } from "../../links/domain/models/Link";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { User } from "../../users/domain/models/User";
import { UserRepository } from "../../users/domain/repositories/UserRepository";
import { VoteDto } from "../../voting/domain/models/VoteDto";
import { VoteRepository } from "../../voting/domain/repositories/VoteRepository";
import { GetCurrentCycleService } from "../../voting/domain/services/GetCurrentCycleService";
import { NoVotesOnThisCycleException } from "../domain/exceptions/NoVotesOnThisCycleException";
import { StageMovement } from "../domain/models/StageMovement";
import { StageMovementRepository } from "../domain/repositories/StageMovementRepository";

export class IncreaseStageOnLinksAndUsersAction {
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
    const [voteCollection, totalVotes] = await this.voteRepository.getAllVotes({
      cycle: lastCycle
    });

    if (totalVotes === 0) {
      throw new NoVotesOnThisCycleException();
    }

    let countLinksUpdated = 0;
    let countUsersUpdated = 0;
    for (let index = 0; index < voteCollection.length; index++) {
      const vote = voteCollection[index];
      countLinksUpdated = await this.calculateStageOnLink(vote, lastCycle, countLinksUpdated);
      countUsersUpdated = await this.calculateStageOnUser(vote, lastCycle, countUsersUpdated);
    };

    return [countLinksUpdated, countUsersUpdated];
  }

  private async calculateStageOnLink(vote: VoteDto, lastCycle: number, countLinksUpdated: number) {
    const stageMovementLink = await this.stageMovementRepository.findStageMovementLink(
      {
        linkUuid: vote.linkUuid,
        cycle: lastCycle
      }
    );

    if (!stageMovementLink) {
      await this.changeStageOnLink(vote, lastCycle);
      countLinksUpdated++;
    }

    return countLinksUpdated;
  }

  private async changeStageOnLink(vote: VoteDto, lastCycle: number) {
    let linkDto = await this.linkRepository.findLink('uuid', vote.linkUuid);
    if (linkDto) {
      const oldStage = linkDto.stage;
      const newStage = 2;
      linkDto.stage = newStage;
      await this.linkRepository.storeLink(new Link(linkDto));
      await this.saveStageMovement(linkDto.uuid, '', oldStage, newStage, lastCycle);
    }
  }

  private async calculateStageOnUser(vote: VoteDto, lastCycle: number, countUsersUpdated: number) {
    const stageMovementUser = await this.stageMovementRepository.findStageMovementLink(
      {
        userUuid: vote.userUuid,
        cycle: lastCycle
      }
    );

    if (!stageMovementUser) {
      await this.changeStageOnUser(vote, lastCycle);
      countUsersUpdated++;
    }

    return countUsersUpdated;
  }

  private async changeStageOnUser(vote: VoteDto, lastCycle: number) {
    let userDto = await this.userRepository.findUser({uuid: vote.userUuid});
    if (userDto) {
      const oldStage = userDto.stage;
      const newStage = 2;
      userDto.stage = newStage;
      await this.userRepository.storeUser(User.factory(userDto));
      await this.saveStageMovement('', userDto.uuid, oldStage, newStage, lastCycle);
    }
  }

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