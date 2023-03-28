import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { LinkDto } from '../domain/models/LinkDto';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { ViewedLinkByUserDataRepository } from '../domain/repositories/ViewedLinkByUserDataRepository';

export class GetAllMyViewedLinkAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  linkRepository: LinkRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository,
    linkRepository: LinkRepository,
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
    this.linkRepository = linkRepository;
  }

  async execute(userUuid: string, linkUuid: string, stage: number) {
    if (!userUuid || !linkUuid || !stage) {
      throw new MandatoryFieldEmptyException();
    }

    const viewedLinks =
      await this.viewedLinkByUserDataRepository.getAllDataByUserUuid(
        userUuid,
        stage,
      );
    const linkUuids = viewedLinks.map((viewedLink) => viewedLink.linkUuid);

    const links: LinkDto[] = await this.linkRepository.findLinks(
      'uuid',
      linkUuids,
    );
    return links;
  }
}
