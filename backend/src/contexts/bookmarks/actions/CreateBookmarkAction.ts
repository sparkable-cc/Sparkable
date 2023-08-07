import { Bookmark } from "../domain/models/Bookmark";
import { BookmarkRepository } from "../domain/repositories/BookmarkRepository";

export class CreateBookmarkAction {
  private bookmarkRepository: BookmarkRepository;

  constructor(
    bookmarkRepository: BookmarkRepository
  ) {
    this.bookmarkRepository = bookmarkRepository;
  }

  async execute(userUuid: string, linkUuid: string) {
    const bookmark = new Bookmark(userUuid, linkUuid);
    await this.bookmarkRepository.storeBookmark(bookmark);
  }

}