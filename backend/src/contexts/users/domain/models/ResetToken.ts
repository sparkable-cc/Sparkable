import { ResetTokenDto } from "./ResetTokenDto";

export class ResetToken {
  private userId: number;
  private token: string;
  private createdAt: Date;

  constructor(userId: number, token:string) {
    this.userId = userId;
    this.token = token;
    this.createdAt = new Date();
  }

  public get getToken(): string {
    return this.token;
  }

  public get getUserId(): number {
    return this.userId;
  }

  public get getCreatedAt(): Date {
    return this.createdAt;
  }

  public toDto(): ResetTokenDto {
    return {
      userId: this.userId,
      token: this.token,
      createdAt: this.createdAt
    }
  }

}
