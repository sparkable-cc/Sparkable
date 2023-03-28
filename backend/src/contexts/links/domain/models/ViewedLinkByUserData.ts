import { MandatoryFieldEmptyException } from '../../../users/domain/exceptions/MandatoryFieldEmptyException';
import { ViewedLinkByUserDataDto } from './ViewedLinkByUserDataDto';

export class ViewedLinkByUserData {
  userUuid: string;
  linkUuid: string;
  stage: number;

  constructor(userUuid: string, linkUuid: string) {
    if (!userUuid || !linkUuid) {
      throw new MandatoryFieldEmptyException();
    }

    this.userUuid = userUuid;
    this.linkUuid = linkUuid;
    this.stage = 1;
  }

  public toDto(): ViewedLinkByUserDataDto {
    return {
      userUuid: this.userUuid,
      linkUuid: this.linkUuid,
      stage: this.stage,
    };
  }
}
