import { ResetTokenDto } from "./ResetTokenDto";

export class ResetToken {
  private userUuid: string;
  private token: string;
  private createdAt: Date;

  constructor(userUuid: string, token:string, createdAt:Date = new Date()) {
    this.userUuid = userUuid;
    this.token = token;
    this.createdAt = createdAt;
  }

  public get getToken(): string {
    return this.token;
  }

  public get getUserUUID(): string {
    return this.userUuid;
  }

  public get getCreatedAt(): Date {
    return this.createdAt;
  }

  public toDto(): ResetTokenDto {
    return {
      userUuid: this.userUuid,
      token: this.token,
      createdAt: this.createdAt
    }
  }

}
