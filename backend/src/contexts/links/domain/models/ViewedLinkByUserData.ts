import { ViewedLinkByUserDataDto } from "./ViewedLinkByUserDataDto";

export class ViewedLinkByUserData {
  userUuid: string;
  linkUuid: string;

  constructor(userUuid:string, linkUuid:string) {
    this.userUuid = userUuid;
    this.linkUuid = linkUuid;
  }

  public toDto(): ViewedLinkByUserDataDto {
    return {
      userUuid: this.userUuid,
      linkUuid: this.linkUuid
    };
  }

}