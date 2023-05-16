import { StageMovement } from "../../../domain/models/StageMovement";
import { StageMovementDto } from "../../../domain/models/StageMovementDto";
import { StageMovementRepository } from "../../../domain/repositories/StageMovementRepository";

export class StageMovementRepositoryInMemory implements StageMovementRepository {

  stageMovementsLinksCollection: StageMovementDto[];

  constructor() {
    this.stageMovementsLinksCollection = [];
  }

  storeStageMovementLink(stageMovementLink: StageMovement): Promise<StageMovementDto> {
    const stageMovementsLinksDto = stageMovementLink.toDto();
    this.stageMovementsLinksCollection.push(stageMovementLink.toDto());

    return new Promise((resolve, rejects) => resolve(stageMovementsLinksDto));
  }

  findStageMovementLink(options: Object): Promise<StageMovementDto | null> {
    const keys = Object.keys(options);
    type ObjectKey = keyof typeof options;
    const propertyOptions = keys[0] as ObjectKey;

    const stageMovementsLinks = this.stageMovementsLinksCollection.find((stageMovementsLinks) => {
      type ObjectKey = keyof typeof stageMovementsLinks;
      const property = keys[0] as ObjectKey;
      return String(stageMovementsLinks[property]) === String(options[propertyOptions]);
    });

    if (stageMovementsLinks)
      return new Promise((resolve, rejects) => resolve(stageMovementsLinks));
    else
      return new Promise((resolve, rejects) => resolve(null));
  }

  all() {
    return this.stageMovementsLinksCollection;
  }
}
