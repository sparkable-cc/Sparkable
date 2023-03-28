import { MandatoryFieldEmptyException } from '../../../users/domain/exceptions/MandatoryFieldEmptyException';
import { User } from '../../../users/domain/models/User';
import { Link } from './Link';
import { ViewedLinkByUserDataDto } from './ViewedLinkByUserDataDto';

export class ViewedLinkByUserData {
  user: User;
  link: Link;
  cycle: number;

  constructor(user: User, link: Link, cycle: number) {
    if (!user || !link || !cycle) {
      throw new MandatoryFieldEmptyException();
    }
    this.user = user;
    this.link = link;
    this.cycle = cycle;
  }

  public toDto(): ViewedLinkByUserDataDto {
    return {
      userUuid: this.user.getUuid,
      linkUuid: this.link.uuid,
      cycle: this.cycle,
      userStage: this.user.getStage,
      linkStage: this.link.stage,
    };
  }
}
