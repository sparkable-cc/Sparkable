import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { Link } from '../domain/models/Link';
import { LinkDto } from '../domain/models/LinkDto';
import { LinkRepository } from '../domain/repositories/LinkRepository';

export class CreateLinkAction {
  linkRepository: LinkRepository;

  constructor(linkRepository: LinkRepository) {
    this.linkRepository = linkRepository;
  }

  async execute(linkData: any) {
    const link = new Link(linkData);
    this.linkRepository.storeLink(link);
  }

  private checkMandatoryFields(link: LinkDto) {
    if (Object.keys(link).length === 0) {
      throw new MandatoryFieldEmptyException();
    }
  }

  private async checkLinkIsNotRepeated(link: LinkDto) {
    const newLink = await this.linkRepository.findLink('link', link.link);
    if (newLink) throw new LinkExistsException();
  }
}
