import { UserNotFoundException } from '../../_shared/domain/exceptions/UserNotFoundException';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { MailerService } from '../../users/domain/services/MailerService';
import { CategoryNotFoundException } from '../domain/exceptions/CategoryNotFoundException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { Link } from '../domain/models/Link';
import { LinkDto } from '../domain/models/LinkDto';
import { CategoryRepository } from '../domain/repositories/CategoryRepository';
import { LinkRepository } from '../domain/repositories/LinkRepository';

export class CreateLinkAction {
  private linkRepository: LinkRepository;
  private categoryRepository: CategoryRepository;
  private userRepository: UserRepository;
  private mailerService: MailerService;

  constructor(
    linkRepository: LinkRepository,
    categoryRepository: CategoryRepository,
    userRepository: UserRepository,
    mailerService: MailerService
  ) {
    this.linkRepository = linkRepository;
    this.categoryRepository = categoryRepository;
    this.userRepository = userRepository;
    this.mailerService = mailerService;
  }

  async execute(linkData: any) {
    const link = new Link(linkData);
    await this.checkExistsCategories(link);
    const user = await this.checkUserExists(link);
    await this.checkUrlIsNew(link);
    link.username = user.username;
    const linkId = await this.linkRepository.storeLink(link);
    link.setId(linkId);
    this.sendEmail(link);
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

  private async sendEmail(link: Link) {
    const href = `${process.env.CLIENT}/article/${link.id}}`;

    const mailOptions = {
      from: 'support@sparkable.cc',
      to: 'support@sparkable.cc',
      subject: 'New link has been created!',
      html: `
        <html>
        <head>
            <style>
            </style>
        </head>
        <body>
            <p>A new link has been created!</p>
            <p><a href="${href}">${link.title}</a></p>
        </body>
        </html>
        `,
    };

    this.mailerService.sendEmail(mailOptions);
  }

}