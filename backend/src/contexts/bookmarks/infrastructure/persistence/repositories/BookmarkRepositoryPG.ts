import { DataSource } from 'typeorm';
import { BookmarkRepository } from '../../../domain/repositories/BookmarkRepository';
import { BookmarkDto } from '../../../domain/models/BookmarkDto';
import { BookmarkEntity } from '../entities/BookmarkEntity';
import { Bookmark } from '../../../domain/models/Bookmark';

export class BookmarkRepositoryPG implements BookmarkRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(BookmarkEntity);
  }

  findBookmark(params:Object): Promise<BookmarkDto | null> {
    return this.repository.findOneBy(params);
  }

  async storeBookmark(bookmark: Bookmark): Promise<number> {
    const result = await this.repository.insert(bookmark.toDto());
    return result.raw[0].id;
  }

}