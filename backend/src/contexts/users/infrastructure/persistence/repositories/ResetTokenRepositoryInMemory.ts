import { ResetToken } from "../../../domain/models/ResetToken";
import { ResetTokenRepository } from "../../../domain/repositories/ResetTokenRepository";

export class ResetTokenRepositoryInMemory implements ResetTokenRepository {

    resetTokens: ResetToken[];

    constructor() {
        this.resetTokens = [];
    }

    save(resetToken: ResetToken) {
        this.resetTokens.push(resetToken);
    };

    all() {
        return this.resetTokens;
    }
}
