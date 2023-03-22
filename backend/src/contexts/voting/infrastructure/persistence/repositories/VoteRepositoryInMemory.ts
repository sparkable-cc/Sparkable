import { VoteDto } from "../../../domain/models/VoteDto";
import { VoteRepository } from "../../../domain/repositories/VoteRepository";

export class VoteRepositoryInMemory implements VoteRepository {

  votes: VoteDto[];

  constructor() {
    this.votes = [];
  }

  findVote(options: Object): Promise<VoteDto | null> {
    return new Promise((resolve) => resolve(this.votes[0]));
  }

}
