import { DataSource } from 'typeorm';
import { ResetTokenRepository } from '../../../domain/repositories/ResetTokenRepository';
import { ResetToken } from '../../../domain/models/ResetToken';
import { ResetTokenEntity } from '../entities/ResetTokenEntity';
import { ResetTokenDto } from '../../../domain/models/ResetTokenDto';

export class ResetTokenRepositoryPG implements ResetTokenRepository {
  private resetTokenRepository;

  constructor(dataSource: DataSource) {
      this.resetTokenRepository = dataSource.getRepository(ResetTokenEntity);
  }

  async saveToken(resetToken: ResetToken) {
    const resetTokenInDatabase = await this.resetTokenRepository.findOneBy(
      { userUuid: resetToken.getUserUUID }
    );

    if (resetTokenInDatabase) {
      await this.resetTokenRepository.update(resetTokenInDatabase.id, resetToken.toDto());
    } else  {
      await this.resetTokenRepository.save(resetToken.toDto());
    }
  }

  async findToken(options: Object): Promise<ResetTokenDto | null> {
    const keys = Object.keys(options);
    type ObjectKey = keyof typeof options;
    const property = keys[0] as ObjectKey;

    return await this.resetTokenRepository.findOne({
        where:{ [property]: options[property] }
    });
  }

}