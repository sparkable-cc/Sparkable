import { VoteDto } from "./VoteDto";

export class Vote {
  userUuid: string;
  linkUuid: string;
  cycle: number;
  userStage: number;
  linkStage: number;

  constructor(voteDto: VoteDto) {
    this.userUuid = voteDto.userUuid;
    this.linkUuid = voteDto.linkUuid;
    this.cycle = voteDto.cycle;
    this.userStage = voteDto.userStage;
    this.linkStage = voteDto.linkStage;
  }

  public toDto(): VoteDto {
    return {
      userUuid: this.userUuid,
      linkUuid: this.linkUuid,
      cycle: this.cycle,
      userStage: this.userStage,
      linkStage: this.linkStage
    };
  }
}
