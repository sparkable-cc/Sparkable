import { DataSource } from 'typeorm';
import { StageMovementsLinks } from '../../../domain/models/StageMovement';
import { StageMovementDto } from '../../../domain/models/StageMovementDto';
import { StageMovementRepository } from '../../../domain/repositories/StageMovementRepository';
import { StageMovementsLinksEntity } from '../entities/StageMovementsLinksEntity';

export class StageMovementsLinksRepositoryPG implements StageMovementRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(StageMovementsLinksEntity);
  }

  storeStageMovementLink(stageMovementLink: StageMovementsLinks): Promise<StageMovementDto> {
    return this.repository.save(stageMovementLink.toDto());
  }

  findStageMovementLink(options: Object): Promise<StageMovementDto | null> {
    return this.repository.findOne({
      where: options
    });
  }

}
