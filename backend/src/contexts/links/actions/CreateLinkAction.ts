import { CategoryNotFoundException } from '../domain/exceptions/CategoryNotFoundException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { Link } from '../domain/models/Link';
import { CategoryRepository } from '../domain/repositories/CategoryRepository';
import { LinkRepository } from '../domain/repositories/LinkRepository';

export class CreateLinkAction {
  linkRepository: LinkRepository;
  categoryRepository: CategoryRepository;

  constructor(linkRepository: LinkRepository, categoryRepository: CategoryRepository) {
    this.linkRepository = linkRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(linkData: any) {
    const link = new Link(linkData);
    await this.checkExistsCategories(link);
    await this.checkUrlIsNew(linkData);
    this.linkRepository.storeLink(link);
  }

  private async checkUrlIsNew(linkData: any) {
    const linkExists = await this.linkRepository.findLink('url', linkData.url);
    if (linkExists)
      throw new LinkExistsException();
  }

  private async checkExistsCategories(link: Link) {
    for (let index = 0; index < link.categories.length; index++) {
      const categoryDto = link.categories[index];
      const category = await this.categoryRepository.findCategoryById(categoryDto.id);
      if (category === null)
        throw new CategoryNotFoundException();
    }
  }
}