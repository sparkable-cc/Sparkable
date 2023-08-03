import { v4 as uuidv4 } from 'uuid';
import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { BookmarkDto } from './BookmarkDto';

export class Bookmark {
  private uuid: string;
  private userUuid: string;
  private linkUuid: string;

  constructor(
    userUuid: string,
    linkUuid: string
  ) {
    if (!userUuid || !linkUuid ) {
      throw new MandatoryFieldEmptyException();
    }

    this.uuid = uuidv4();
    this.userUuid = userUuid;
    this.linkUuid = linkUuid;
  }

  public toDto(): BookmarkDto {
    return {
      uuid: this.uuid,
      userUuid: this.userUuid,
      linkUuid: this.linkUuid
    };
  }
}