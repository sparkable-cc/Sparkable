import { Voting } from "../../../domain/models/Voting";
import { VotingDto } from "../../../domain/models/VotingDto";
import { VotingRepository } from "../../../domain/repositories/VotingRepository";

export class VotingRepositoryInMemory implements VotingRepository {

  votes: VotingDto[];

  constructor() {
    this.votes = [];
  }

  storeVoting(vote: Voting): Promise<VotingDto> {
    const voteDto = vote.toDto();

    this.votes.push(voteDto);

    return new Promise((resolve) => resolve(voteDto));
  }

  getAllVotings(): Promise<VotingDto[] | null> {
    return new Promise((resolve) => resolve(this.votes));
  }

  findVote(options: Object): Promise<VotingDto | null> {
    return new Promise((resolve) => resolve(this.votes[0]));
  }

}
