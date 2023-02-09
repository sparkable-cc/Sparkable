import { DataSource } from 'typeorm';
import { ResetTokenRepository } from '../../../domain/repositories/ResetTokenRepository';
import { ResetToken } from '../../../domain/models/ResetToken';
import { ResetTokenEntity } from '../entities/ResetTokenEntity';

export class ResetTokenRepositoryPG implements ResetTokenRepository {
  private resetTokenRepository;

  constructor(dataSource: DataSource) {
      this.resetTokenRepository = dataSource.getRepository(ResetTokenEntity);
  }

  async save(resetToken: ResetToken) {
    const resetTokenInDatabase = await this.resetTokenRepository.findOneBy(
      { userId: resetToken.getUserId }
    );

    if (resetTokenInDatabase) {
      await this.resetTokenRepository.update(resetTokenInDatabase.id, resetToken.toDto());
    } else  {
      await this.resetTokenRepository.save(resetToken.toDto());
    }

  }

}