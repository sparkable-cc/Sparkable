import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { UserNotFoundException } from '../../users/domain/exceptions/UserNotFoundException';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { LinkNotFoundException } from '../domain/exceptions/LinkNotFoundException';
import { ViewedLinkByUserData } from '../domain/models/ViewedLinkByUserData';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { ViewedLinkByUserDataRepository } from '../domain/repositories/ViewedLinkByUserDataRepository';

export class CreateViewedLinkByUserDataAction {
  userRepository: UserRepository;
  linkRepository: LinkRepository;
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;

  constructor(
    userRepository: UserRepository,
    linkRepository: LinkRepository,
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository
  ) {
    this.linkRepository = linkRepository;
    this.userRepository = userRepository;
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
  }

  async execute(userUuid: string, linkUuid: string) {
    if (!userUuid || !linkUuid) {
      throw new MandatoryFieldEmptyException();
    }

    const user = await this.userRepository.findUser({ uuid: userUuid });
    if (!user)
      throw new UserNotFoundException();

    const link = await this.linkRepository.findLink('uuid', linkUuid);
    if (!link)
      throw new LinkNotFoundException();

    this.viewedLinkByUserDataRepository.store(
      new ViewedLinkByUserData(user.uuid, link.uuid)
    );
  }

}