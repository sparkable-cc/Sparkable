import { ResetToken } from "../../../domain/models/ResetToken";
import { ResetTokenDto } from "../../../domain/models/ResetTokenDto";
import { ResetTokenRepository } from "../../../domain/repositories/ResetTokenRepository";

export class ResetTokenRepositoryInMemory implements ResetTokenRepository {

  resetTokens: ResetTokenDto[];

  constructor() {
    this.resetTokens = [];
  }

  saveToken(resetToken: ResetToken) {
    this.resetTokens.push(resetToken.toDto());
  };

  findToken(options: Object): Promise<ResetTokenDto | null> {
    const keys = Object.keys(options);
    type ObjectKey = keyof typeof options;
    const propertyOptions = keys[0] as ObjectKey;

    const resetToken = this.resetTokens.find((resetToken) => {
      type ObjectKey = keyof typeof resetToken;
      const property = keys[0] as ObjectKey;
      return String(resetToken[property]) === String(options[propertyOptions]);
    })

    if (resetToken) return new Promise((resolve, rejects) => resolve(resetToken));
    else return new Promise((resolve, rejects) => resolve(null));
  }

  all() {
    return this.resetTokens;
  }
}
