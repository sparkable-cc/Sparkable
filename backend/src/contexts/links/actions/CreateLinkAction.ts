import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { Link } from '../domain/models/Link';
import { LinkRepository } from '../domain/repositories/LinkRepository';

export class CreateLinkAction {
  linkRepository: LinkRepository;

  constructor(linkRepository: LinkRepository) {
    this.linkRepository = linkRepository;
  }

  async execute(linkData: any) {
    const link = new Link(linkData);

    const linkExists = await this.linkRepository.findLink(
      'link',
      linkData.link,
    );
    if (linkExists) {
      throw new LinkExistsException();
    }

    this.linkRepository.storeLink(link);

    return link.toDto();
  }
}
