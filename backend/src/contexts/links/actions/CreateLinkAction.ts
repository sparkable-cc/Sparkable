import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
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
}
