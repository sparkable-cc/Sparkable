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

    const linkExists = await this.linkRepository.findLink(
      'url',
      linkData.url,
    );
    if (linkExists) {
      throw new LinkExistsException();
    }

    this.linkRepository.storeLink(link);
  }
}