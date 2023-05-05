import { StageMovementsLinksDto } from "./StageMovementsLinksDto";

export class StageMovementsLinks {
  private linkUuid: string;
  private oldStage: number;
  private newStage: number;
  private cycle: number;

  constructor(linkUuid: string, oldStage:number, newStage:number, cycle: number) {
    this.linkUuid = linkUuid;
    this.oldStage = oldStage;
    this.newStage = newStage;
    this.cycle = cycle;
  }

  public toDto(): StageMovementsLinksDto {
    return {
      linkUuid: this.linkUuid,
      oldStage: this.oldStage,
      newStage: this.newStage,
      cycle: this.cycle
    }
  }

}
