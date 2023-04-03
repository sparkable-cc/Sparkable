import { VotingDto } from "./VotingDto";

export class Voting {
  userUuid: string;
  cycle: number;
  countVotes: number;

  constructor(userUuid: string, cycle: number, countVotes: number) {
    this.userUuid = userUuid;
    this.cycle = cycle;
    this.countVotes = countVotes;
  }

  public toDto(): VotingDto {
    return {
      userUuid: this.userUuid,
      cycle: this.cycle,
      countVotes: this.countVotes
    };
  }
}
