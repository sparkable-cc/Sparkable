import { DataSource } from 'typeorm';
import { Voting } from "../../../domain/models/Voting";
import { VotingDto } from "../../../domain/models/VotingDto";
import { VoteRepository } from "../../../domain/repositories/VoteRepository";
import { VotingEntity } from '../entities/VotingEntity';

export class VoteRepositoryPG implements VoteRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(VotingEntity);
  }

  storeVote(vote: Voting): Promise<VotingDto> {
    return new Promise((resolve) => resolve(vote.toDto()));
  }

  getAllVotes(): Promise<VotingDto[] | null> {
    return new Promise((resolve) => resolve(null));
  }

  findVote(options: Object): Promise<VotingDto | null> {
    return new Promise((resolve) => resolve(null));
  }

}
