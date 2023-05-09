import { LinkRepository } from '../domain/repositories/LinkRepository';

export class GetAllLinksAction {
  linkRepository:LinkRepository;

  constructor(linkRepository:LinkRepository) {
    this.linkRepository = linkRepository;
  }

  execute(
    sort?:string,
    categories?:string,
    page?:number,
    stage?:number
  ) {
    return this.linkRepository.getAllLinks(
      sort,
      categories,
      page,
      stage
    );
  }

}