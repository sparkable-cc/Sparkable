import { StageMovementDto } from "./StageMovementDto";

export class StageMovement {
  private stageMovementDto: StageMovementDto;

  constructor(stageMovementDto: StageMovementDto) {
    this.stageMovementDto = stageMovementDto;
  }

  public toDto(): StageMovementDto {
    return this.stageMovementDto;
  }

}
