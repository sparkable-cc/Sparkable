import { Link } from '../../../domain/models/Link';
import { LinkDto } from '../../../domain/models/LinkDto';
import { LinkRepository } from '../../../domain/repositories/LinkRepository';

export class LinkRepositoryInMemory implements LinkRepository {
  links: LinkDto[];

  constructor() {
    this.links = [];
  }

  getAllLinks(
    sort?: string | undefined,
    categories?: string | undefined,
    page?:number
  ): Promise<[LinkDto[], number]> {
    return new Promise((resolve) => resolve([this.links, this.links.length]));
  }

  getLinkById(id: number): Promise<LinkDto | null> {
    return new Promise((resolve) => resolve(this.links[0]));
  }

  storeLink(link: Link): Promise<LinkDto> {
    this.links.push(link.toDto());
    return new Promise((resolve) => resolve(link.toDto()));
  }

  findLink(field: string, value: string): Promise<LinkDto | null> {
    const link = this.links.find((link) => {
      let url = field as keyof LinkDto;
      return link[url] === value;
    });
    if (link) {
      return new Promise((resolve) => resolve(link));
    } else {
      return new Promise((resolve) => resolve(null));
    }
  }
}