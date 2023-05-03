import { StageMovementsLinks } from "../models/StageMovementsLinks";
import { StageMovementsLinksDto } from "../models/StageMovementsLinksDto";

export interface StageMovementsLinksRepository {
  storeStageMovementLink: (stageMovementLink:StageMovementsLinks) => Promise<StageMovementsLinksDto>;
  findStageMovementLink:(options: Object) => Promise<StageMovementsLinksDto | null>;
}