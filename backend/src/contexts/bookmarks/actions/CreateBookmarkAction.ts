import { Bookmark } from "../domain/models/Bookmark";
import { BookmarkRepository } from "../domain/repositories/BookmarkRepository";
import { BookmarkReallyDoesExistException } from "../domain/exceptions/BookmarkReallyDoesExistException";
import { CheckLinkExistsService } from "../../_shared/domain/services/CheckLinkExistsService";

export class CreateBookmarkAction {
  private bookmarkRepository: BookmarkRepository;
  private checkLinkExistsService: CheckLinkExistsService;

  constructor(
    bookmarkRepository: BookmarkRepository,
    checkLinkExistsService: CheckLinkExistsService
  ) {
    this.bookmarkRepository = bookmarkRepository;
    this.checkLinkExistsService = checkLinkExistsService;
  }

  async execute(userUuid: string, linkUuid: string) {
    const bookmark = new Bookmark(userUuid, linkUuid);
    await this.checkLinkExistsService.execute(linkUuid);
    await this.checkBookmarkExists(userUuid, linkUuid);
    await this.bookmarkRepository.storeBookmark(bookmark);
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