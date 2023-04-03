import { DataSource } from 'typeorm';
import { Voting } from "../../../domain/models/Voting";
import { VotingDto } from "../../../domain/models/VotingDto";
import { VotingRepository } from "../../../domain/repositories/VotingRepository";
import { VotingEntity } from '../entities/VotingEntity';

export class VoteRepositoryPG implements VotingRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(VotingEntity);
  }

  storeVoting(vote: Voting): Promise<VotingDto> {
    return new Promise((resolve) => resolve(vote.toDto()));
  }

  getAllVotes(): Promise<VotingDto[] | null> {
    return new Promise((resolve) => resolve(null));
  }

  findVote(options: Object): Promise<VotingDto | null> {
    return new Promise((resolve) => resolve(null));
  }

}
