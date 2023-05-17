import { StageMovement } from "../models/StageMovement";
import { StageMovementDto } from "../models/StageMovementDto";

export interface StageMovementRepository {
  storeStageMovementLink: (stageMovementLink:StageMovement) => Promise<StageMovementDto>;
  findStageMovementLink:(options: Object) => Promise<StageMovementDto | null>;
  getAllStageMovement:() => Promise<[StageMovementDto[], number]>;
}