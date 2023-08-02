import { UserNotFoundException } from "../../_shared/domain/exceptions/UserNotFoundException";
import { LinkNotFoundException } from "../../_shared/domain/exceptions/LinkNotFoundException";
import { Bookmark } from "../domain/models/Bookmark";
import { UserRepository } from "../../users/domain/repositories/UserRepository";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { BookmarkRepository } from "../domain/repositories/BookmarkRepository";
import { BookmarkReallyDoesExistException } from "../domain/exceptions/BookmarkReallyDoesExistException";


export class CreateBookmarkAction {
  private bookmarkRepository: BookmarkRepository;
  private userRepository: UserRepository;
  private linkRepository: LinkRepository;

  constructor(
    bookmarkRepository: BookmarkRepository,
    userRepository: UserRepository,
    linkRepository: LinkRepository
  ) {
    this.bookmarkRepository = bookmarkRepository;
    this.userRepository = userRepository;
    this.linkRepository = linkRepository;
  }

  async execute(userUuid: string, linkUuid: string) {
    const bookmark = new Bookmark(userUuid, linkUuid);
    await this.checkUserExists(userUuid);
    await this.checkLinkExists(linkUuid);
    await this.checkBookmarkExists(userUuid, linkUuid);
    await this.bookmarkRepository.storeBookmark(bookmark);
  }

  // Refactor to Service
  private async checkUserExists(userUuid:string) {
    const user = await this.userRepository.findUser({ uuid: userUuid });
    if (!user)
      throw new UserNotFoundException();

    return user;
  }

  // Refactor to Service
  private async checkLinkExists(linkUuid: string) {
    const link = await this.linkRepository.findLink('uuid', linkUuid);
    if (!link)
      throw new LinkNotFoundException();

    return link;
  }

  private async checkBookmarkExists(userUuid:string, linkUuid: string) {
    const bookmark = await this.bookmarkRepository.findBookmark({
      userUuid: userUuid,
      linkUuid: linkUuid
    });

    if (bookmark)
      throw new BookmarkReallyDoesExistException();
  }

}