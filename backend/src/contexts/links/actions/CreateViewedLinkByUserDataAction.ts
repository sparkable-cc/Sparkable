import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { UserNotFoundException } from '../../users/domain/exceptions/UserNotFoundException';
import { User } from '../../users/domain/models/User';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { DataDoesExistException } from '../domain/exceptions/DataDoesExistException';
import { LinkNotFoundException } from '../domain/exceptions/LinkNotFoundException';
import { Link } from '../domain/models/Link';
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
    this.userRepository = userRepository;
    this.linkRepository = linkRepository;
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
  }

  async execute(userUuid: string, linkUuid: string, cycle: number) {
    if (!userUuid || !linkUuid || !cycle) {
      throw new MandatoryFieldEmptyException();
    }

    const userDto = await this.checkUserDoesExist(userUuid);
    const linkDto = await this.checkLinkDoesExist(linkUuid);

    const user = User.factory(userDto);
    const link = Link.factory(linkDto);

    const data = new ViewedLinkByUserData(user, link, cycle);

    await this.checkDataIsNew(userUuid, linkUuid, user.getStage, link.stage);
    this.viewedLinkByUserDataRepository.store(data);
  }

  private async checkUserDoesExist(userUuid: string) {
    const user = await this.userRepository.findUser({ uuid: userUuid });
    if (!user)
      throw new UserNotFoundException();

    return user;
  }

  private async checkLinkDoesExist(linkUuid: string) {
    const link = await this.linkRepository.findLink('uuid', linkUuid);
    if (!link)
      throw new LinkNotFoundException();

    return link;
  }

  private async checkDataIsNew(userUuid: string, linkUuid: string, userStage: number, linkStage: number) {
    const dataInDatabase = await this.viewedLinkByUserDataRepository.findData({
      userUuid: userUuid,
      linkUuid: linkUuid,
      userStage: userStage,
      linkStage: linkStage
    });
    if (dataInDatabase)
      throw new DataDoesExistException();
  }

}