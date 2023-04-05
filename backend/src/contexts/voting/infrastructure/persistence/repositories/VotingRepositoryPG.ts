import { DataSource } from 'typeorm';
import { Voting } from "../../../domain/models/Voting";
import { VotingDto } from "../../../domain/models/VotingDto";
import { VotingRepository } from "../../../domain/repositories/VotingRepository";
import { VotingEntity } from '../entities/VotingEntity';

export class VotingRepositoryPG implements VotingRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(VotingEntity);
  }

  storeVoting(voting: Voting): Promise<VotingDto> {
    return this.repository.save(voting.toDto());
  }

}
