import { DataSource } from 'typeorm';
import { BookmarkRepository } from '../../../domain/repositories/BookmarkRepository';
import { BookmarkDto } from '../../../domain/models/BookmarkDto';
import { BookmarkEntity } from '../entities/BookmarkEntity';
import { Bookmark } from '../../../domain/models/Bookmark';
import { resourceLimits } from 'worker_threads';
import { NotFoundException } from '../../../../_shared/domain/exceptions/NotFoundException';
import { UserNotFoundException } from '../../../../_shared/domain/exceptions/UserNotFoundException';

export class BookmarkRepositoryPG implements BookmarkRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(BookmarkEntity);
  }

  findBookmark(params:Object): Promise<BookmarkDto | null> {
    return this.repository.findOneBy(params);
  }

  async storeBookmark(bookmark: Bookmark): Promise<number> {
    let result:any;

    await this.repository.insert(bookmark.toDto())
    .then((insertInfo) => {
      result = insertInfo;
    })
    .catch((error) => {
      if (error.detail.includes('is not present in table "users"')) {
        throw new UserNotFoundException();
      }
    });

    return new Promise((resolve) => resolve(result.raw[0].id));
  }

  async removeBookmark(bookmark: Bookmark): Promise<any> {
    const result = await this.repository.delete(bookmark.toDto());

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}