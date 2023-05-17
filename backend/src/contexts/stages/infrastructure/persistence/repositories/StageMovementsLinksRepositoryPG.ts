import { DataSource } from 'typeorm';
import { StageMovement } from '../../../domain/models/StageMovement';
import { StageMovementDto } from '../../../domain/models/StageMovementDto';
import { StageMovementRepository } from '../../../domain/repositories/StageMovementRepository';
import { StageMovementEntity } from '../entities/StageMovementEntity';

export class StageMovementRepositoryPG implements StageMovementRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(StageMovementEntity);
  }

  storeStageMovementLink(stageMovement: StageMovement): Promise<StageMovementDto> {
    return this.repository.save(stageMovement.toDto());
  }

  findStageMovementLink(options: Object): Promise<StageMovementDto | null> {
    return this.repository.findOne({
      where: options
    });
  }

  getAllStageMovement(): Promise<[StageMovementDto[], number]> {
    return this.repository.findAndCount();
  }

}
