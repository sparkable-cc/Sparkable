import { MandatoryFieldEmptyException } from '../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { UserCanNotEditException } from '../domain/exceptions/UserCanNotEditException';
import { Link } from '../domain/models/Link';
import { LinkDto } from '../domain/models/LinkDto';
import { UpdateLinkDto } from '../domain/models/UpdateLinkDto';
import { LinkRepository } from '../domain/repositories/LinkRepository';

export class UpdateLinkAction {
  private linkRepository: LinkRepository;

  constructor(
    linkRepository: LinkRepository,
  ) {
    this.linkRepository = linkRepository;
  }

  async execute(userUuid: string, updateLinkDto: UpdateLinkDto) {
    if (!updateLinkDto.uuid) {
      throw new MandatoryFieldEmptyException();
    }

    let linkDto = await this.linkRepository.findLink('uuid', updateLinkDto.uuid);
    this.canUserEdit(linkDto, userUuid);

    if (linkDto && updateLinkDto.statement) linkDto.statement = updateLinkDto.statement;

    await this.linkRepository.storeLink(new Link(linkDto));
  }

  private canUserEdit(linkDto:LinkDto | null, userUuid: string) {
    if (linkDto?.userUuid !== userUuid) {
      throw new UserCanNotEditException();
    }
  }

}