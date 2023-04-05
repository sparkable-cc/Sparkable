import { StageDoesNotExistException } from "../exceptions/StageDoesNotExistException";

export class Stage {
  round: number;

  constructor(round: number) {
    if (round <= 0 || round > 4) {
      throw new StageDoesNotExistException();
    }

    this.round = round;
  }

  public toDto(): number {
    return this.round;
  }

}