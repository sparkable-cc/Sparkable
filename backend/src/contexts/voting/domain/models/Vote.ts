import { LinkDto } from "../../../links/domain/models/LinkDto";
import { VoteDto } from "./VoteDto";

export class Vote {
  userUuid: string;
  cycle: number;
  votes: LinkDto[];
  count: number;

  constructor(userUuid: string, cycle: number, votes: Array<LinkDto>) {
    this.userUuid = userUuid;
    this.cycle = cycle;
    this.votes = votes;
    this.count = votes.length;
  }

  public toDto(): VoteDto {
    return {
      userUuid: this.userUuid,
      cycle: this.cycle,
      votes: this.votes,
      count: this.count
    };
  }
}
