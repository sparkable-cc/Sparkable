import { LinkDto } from "../../../links/domain/models/LinkDto";
import { VotingDto } from "./VotingDto";

export class Voting {
  userUuid: string;
  cycle: number;
  votes: string[];
  count: number;

  constructor(userUuid: string, cycle: number, votes: Array<string>) {
    this.userUuid = userUuid;
    this.cycle = cycle;
    this.votes = votes;
    this.count = votes.length;
  }

  public toDto(): VotingDto {
    return {
      userUuid: this.userUuid,
      cycle: this.cycle,
      votes: this.votes,
      count: this.count
    };
  }
}
