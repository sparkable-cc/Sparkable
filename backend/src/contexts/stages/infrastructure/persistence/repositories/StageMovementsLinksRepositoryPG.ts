import { DataSource } from 'typeorm';
import { StageMovementsLinks } from '../../../domain/models/StageMovementsLinks';
import { StageMovementsLinksDto } from '../../../domain/models/StageMovementsLinksDto';
import { StageMovementsLinksRepository } from '../../../domain/repositories/StageMovementsLinksRepository';
import { StageMovementsLinksEntity } from '../entities/StageMovementsLinksEntity';

export class StageMovementsLinksRepositoryPG implements StageMovementsLinksRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(StageMovementsLinksEntity);
  }

  storeStageMovementLink(stageMovementLink: StageMovementsLinks): Promise<StageMovementsLinksDto> {
    return this.repository.save(stageMovementLink.toDto());
  }

  findStageMovementLink(options: Object): Promise<StageMovementsLinksDto | null> {
    return this.repository.findOne({
      where: options
    });
  }

}
