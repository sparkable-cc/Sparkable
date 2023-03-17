import { VotingCycleDoesNotExistException } from "../exceptions/VotingCycleDoesNotExistException";

export class Cycle {
  round: number;

  constructor(round: number) {
    if (round <= 0 || round > 4) {
      throw new VotingCycleDoesNotExistException();
    }

    this.round = round;
  }

  public toDto(): number {
    return this.round;
  }

}