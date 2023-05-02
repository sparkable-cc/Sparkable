import { Vote } from "../../../domain/models/Vote";
import { VoteDto } from "../../../domain/models/VoteDto";
import { VoteRepository } from "../../../domain/repositories/VoteRepository";

export class VoteRepositoryInMemory implements VoteRepository {

  votes: VoteDto[];

  constructor() {
    this.votes = [];
  }

  storeVote(vote: Vote): Promise<VoteDto> {
    const voteDto = vote.toDto();
    this.votes.push(voteDto);
    return new Promise((resolve) => resolve(voteDto));
  }

  getAllVotes(options?: Object): Promise<[VoteDto[], number]> {
    return new Promise((resolve) => resolve([this.votes, this.votes.length]));
  }

}
