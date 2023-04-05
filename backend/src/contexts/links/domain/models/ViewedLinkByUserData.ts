import { MandatoryFieldEmptyException } from '../../../users/domain/exceptions/MandatoryFieldEmptyException';
import { User } from '../../../users/domain/models/User';
import { Link } from './Link';
import { ViewedLinkByUserDataDto } from './ViewedLinkByUserDataDto';

export class ViewedLinkByUserData {
  userUuid: string;
  linkUuid: string;
  cycle: number;
  voted: boolean;

  constructor(
    userUuid:string,
    linkUuid:string,
    cycle: number,
    voted: boolean = false
  ) {
    if (!userUuid || !linkUuid || !cycle) {
      throw new MandatoryFieldEmptyException();
    }

    this.userUuid = userUuid;
    this.linkUuid = linkUuid;
    this.cycle = cycle;
    this.voted = voted
  }

  public toDto(): ViewedLinkByUserDataDto {
    return {
      userUuid: this.userUuid,
      linkUuid: this.linkUuid,
      cycle: this.cycle,
      userStage: 1,
      linkStage: 1,
      voted: this.voted
    };
  }
}
