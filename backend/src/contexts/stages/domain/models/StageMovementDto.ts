export interface StageMovementDto {
  linkUuid: string;
  userUuid: string;
  oldStage: number;
  newStage: number;
  cycle: number;
}