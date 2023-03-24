import { DataSource } from 'typeorm';
import { Vote } from "../../../domain/models/Vote";
import { VoteDto } from "../../../domain/models/VoteDto";
import { VoteRepository } from "../../../domain/repositories/VoteRepository";

export class VoteRepositoryPG implements VoteRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(VoteEntity);
  }

  storeVote(vote: Vote): Promise<VoteDto> {
    return new Promise((resolve) => resolve(vote.toDto()));
  }

  getAllVotes(): Promise<VoteDto[] | null> {
    return new Promise((resolve) => resolve(null));
  }

  findVote(options: Object): Promise<VoteDto | null> {
    return new Promise((resolve) => resolve(null));
  }

}
