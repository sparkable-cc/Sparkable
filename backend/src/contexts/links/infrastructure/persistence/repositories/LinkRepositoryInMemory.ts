import { Link } from '../../../domain/models/Link';
import { LinkDto } from '../../../domain/models/LinkDto';
import { LinkRepository } from '../../../domain/repositories/LinkRepository';

export class LinkRepositoryInMemory implements LinkRepository {
  links: LinkDto[];

  constructor() {
    this.links = [];
  }

  storeLink(link: Link) {
    this.links.push(link.toDto());
  }

  getAllLinks(
    sort?: string | undefined,
    categories?: string | undefined,
  ): Promise<[LinkDto[], number]> {
    return new Promise((resolve) => resolve([this.links, this.links.length]));
  }
}
