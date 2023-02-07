
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

}
