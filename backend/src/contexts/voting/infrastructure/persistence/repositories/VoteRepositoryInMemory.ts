import { Voting } from "../../../domain/models/Voting";
import { VotingDto } from "../../../domain/models/VotingDto";
import { VoteRepository } from "../../../domain/repositories/VoteRepository";

export class VoteRepositoryInMemory implements VoteRepository {

  votes: VotingDto[];

  constructor() {
    this.votes = [];
  }

  storeVote(vote: Voting): Promise<VotingDto> {
    const voteDto = vote.toDto();

    this.votes.push(voteDto);

    return new Promise((resolve) => resolve(voteDto));
  }

  getAllVotes(): Promise<VotingDto[] | null> {
    return new Promise((resolve) => resolve(this.votes));
  }

  findVote(options: Object): Promise<VotingDto | null> {
    return new Promise((resolve) => resolve(this.votes[0]));
  }

}
