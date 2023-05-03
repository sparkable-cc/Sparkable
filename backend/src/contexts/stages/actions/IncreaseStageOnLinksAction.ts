import { Link } from "../../links/domain/models/Link";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { VoteDto } from "../../voting/domain/models/VoteDto";
import { VoteRepository } from "../../voting/domain/repositories/VoteRepository";
import { GetCurrentCycleService } from "../../voting/domain/services/GetCurrentCycleService";
import { NoVotesOnThisCycleException } from "../domain/exceptions/NoVotesOnThisCycleException";
import { StageMovementsLinks } from "../domain/models/StageMovementsLinks";
import { StageMovementsLinksRepository } from "../domain/repositories/StageMovementsLinksRepository";

export class IncreaseStageOnLinksAction {
  voteRepository: VoteRepository;
  linkRepository: LinkRepository;
  stageMovementsLinksRepository: StageMovementsLinksRepository;

  constructor(
    voteRepository: VoteRepository,
    linkRepository: LinkRepository,
    stageMovementsLinksRepository: StageMovementsLinksRepository
  ) {
    this.voteRepository = voteRepository;
    this.linkRepository = linkRepository;
    this.stageMovementsLinksRepository = stageMovementsLinksRepository;
  }

  async execute() {
    const lastCycle = GetCurrentCycleService.execute().cycle - 1;
    const [voteCollection, totalVotes] = await this.voteRepository.getAllVotes({
      cycle: lastCycle
    });

    if (totalVotes === 0) {
      throw new NoVotesOnThisCycleException();
    }

    for (let index = 0; index < voteCollection.length; index++) {
      const vote = voteCollection[index];
      const stageMovementLink = await this.stageMovementsLinksRepository.findStageMovementLink(
        {
          linkUuid: vote.linkUuid,
          cycle: lastCycle
        }
      );

      if (!stageMovementLink) {
        await this.changeStageOnLink(vote, lastCycle);
      }
    };

    return totalVotes;
  }

  private async changeStageOnLink(vote: VoteDto, lastCycle: number) {
    let linkDto = await this.linkRepository.findLink('uuid', vote.linkUuid);
    if (linkDto) {
      const oldStage = linkDto.stage;
      const newStage = 2;
      linkDto.stage = newStage;
      await this.linkRepository.storeLink(new Link(linkDto));
      await this.stageMovementsLinksRepository.storeStageMovementLink(
        new StageMovementsLinks(
          linkDto.uuid,
          oldStage,
          newStage,
          lastCycle
        )
      );
    }
  }
}