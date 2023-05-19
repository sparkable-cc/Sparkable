import { StageMovement } from "../models/StageMovement";
import { StageMovementRepository } from "../repositories/StageMovementRepository";

export class StoreStageMovementService {
  stageMovementRepository: StageMovementRepository;

  constructor(
    stageMovementRepository: StageMovementRepository
  ) {
    this.stageMovementRepository = stageMovementRepository;
  }

  async execute(linkUuid: string, userUuid: string, oldStage: number, newStage: number, lastCycle: number) {
    await this.stageMovementRepository.storeStageMovementLink(
      new StageMovement(
        {
          linkUuid: linkUuid,
          userUuid: userUuid,
          oldStage,
          newStage,
          cycle: lastCycle
        }
      )
    );
  }

}