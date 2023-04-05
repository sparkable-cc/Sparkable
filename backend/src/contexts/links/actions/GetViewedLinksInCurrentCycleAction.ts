import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { GetCurrentCycleService } from '../../voting/domain/services/GetCurrentCycleService';
import { LinkDto } from '../domain/models/LinkDto';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { ViewedLinkByUserDataRepository } from '../domain/repositories/ViewedLinkByUserDataRepository';

export class GetViewedLinksInCurrentCycleAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  linkRepository: LinkRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository,
    linkRepository: LinkRepository,
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
    this.linkRepository = linkRepository;
  }

  async execute(userUuid: string) {
    if (!userUuid) {
      throw new MandatoryFieldEmptyException();
    }

    const viewedLinks =
      await this.viewedLinkByUserDataRepository.getAllDataByUserByCycleNotVoted(
        userUuid,
        GetCurrentCycleService.execute().cycle
      );

    let links: LinkDto[] = [];
    if (viewedLinks.length !== 0) {
      links = await this.linkRepository.getLinkCollectionNotOwned(
        viewedLinks.map((viewedLink) => viewedLink.linkUuid),
        userUuid
      );
    }

    return links;
  }

}
