import { MandatoryFieldEmptyException } from "../../../users/domain/exceptions/MandatoryFieldEmptyException";
import { Cycle } from "../../../voting/domain/models/Cycle";
import { ViewedLinkByUserDataDto } from "./ViewedLinkByUserDataDto";

export class ViewedLinkByUserData {
  userUuid: string;
  linkUuid: string;
  cycle: number;

  constructor(userUuid:string, linkUuid:string, cycle: Cycle) {
    if (!userUuid || !linkUuid || !cycle) {
      throw new MandatoryFieldEmptyException();
    }
    this.userUuid = userUuid;
    this.linkUuid = linkUuid;
    this.cycle = cycle.toDto()
  }

  public toDto(): ViewedLinkByUserDataDto {
    return {
      userUuid: this.userUuid,
      linkUuid: this.linkUuid,
      cycle: this.cycle
    };
  }

}