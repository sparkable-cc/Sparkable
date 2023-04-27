import { Link } from "../../links/domain/models/Link";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { VoteRepository } from "../../voting/domain/repositories/VoteRepository";
import { GetCurrentCycleService } from "../../voting/domain/services/GetCurrentCycleService";
import { NoVotesOnThisCycleException } from "../domain/exceptions/NoVotesOnThisCycleException";

export class IncreaseStageOnLinksAction {
  voteRepository: VoteRepository;
  linkRepository: LinkRepository;

  constructor(
    voteRepository: VoteRepository,
    linkRepository: LinkRepository
  ) {
    this.voteRepository = voteRepository;
    this.linkRepository = linkRepository;
  }

  async execute() {
    const [voteCollection, totalVotes] = await this.voteRepository.getAllVotes({
      cycle: GetCurrentCycleService.execute()
    });

    if (totalVotes === 0) {
      throw new NoVotesOnThisCycleException();
    }

    voteCollection.forEach(async vote => {
      let linkDto = await this.linkRepository.findLink('uuid', vote.linkUuid);
      if (linkDto) linkDto.stage = 2;
      this.linkRepository.storeLink(new Link(linkDto));
    });

    return totalVotes;
  }

}