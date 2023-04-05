import { DataSource } from 'typeorm';
import { Vote } from '../../../domain/models/Vote';
import { VoteDto } from '../../../domain/models/VoteDto';
import { VoteRepository } from '../../../domain/repositories/VoteRepository';
import { VoteEntity } from '../entities/VoteEntity';

export class VoteRepositoryPG implements VoteRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(VoteEntity);
  }

  storeVote(vote: Vote): Promise<VoteDto> {
    return this.repository.save(vote.toDto());
  }

}
