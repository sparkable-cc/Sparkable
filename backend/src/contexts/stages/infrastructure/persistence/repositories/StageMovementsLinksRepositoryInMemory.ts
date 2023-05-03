import { StageMovementsLinks } from "../../../domain/models/StageMovementsLinks";
import { StageMovementsLinksDto } from "../../../domain/models/StageMovementsLinksDto";
import { StageMovementsLinksRepository } from "../../../domain/repositories/StageMovementsLinksRepository";

export class StageMovementsLinksRepositoryInMemory implements StageMovementsLinksRepository {

  stageMovementsLinksCollection: StageMovementsLinksDto[];

  constructor() {
    this.stageMovementsLinksCollection = [];
  }

  storeStageMovementLink(stageMovementLink: StageMovementsLinks) {
    this.stageMovementsLinksCollection.push(stageMovementLink.toDto());
  }

  findStageMovementLink(options: Object): Promise<StageMovementsLinksDto | null> {
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
