import { UserNotFoundException } from '../../users/domain/exceptions/UserNotFoundException';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { CategoryNotFoundException } from '../domain/exceptions/CategoryNotFoundException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { Link } from '../domain/models/Link';
import { CategoryRepository } from '../domain/repositories/CategoryRepository';
import { LinkRepository } from '../domain/repositories/LinkRepository';

export class CreateLinkAction {
  linkRepository: LinkRepository;
  categoryRepository: CategoryRepository;
  userRepository: UserRepository;

  constructor(
    linkRepository: LinkRepository,
    categoryRepository: CategoryRepository,
    userRepository: UserRepository
  ) {
    this.linkRepository = linkRepository;
    this.categoryRepository = categoryRepository;
    this.userRepository = userRepository;
  }

  async execute(linkData: any) {
    const link = new Link(linkData);
    await this.checkExistsCategories(link);
    const user = await this.checkUserExists(link);
    await this.checkUrlIsNew(link);
    link.username = user.username;
    await this.linkRepository.storeLink(link);
  }

  private async checkUrlIsNew(linkData: any) {
    const linkExists = await this.linkRepository.findLink('url', linkData.url);
    if (linkExists)
      throw new LinkExistsException();
  }

  private async checkUserExists(link: Link) {
    const user = await this.userRepository.findUser({ uuid: link.userUuid });
    if (!user)
      throw new UserNotFoundException();

    return user;
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