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

  findVoting(options: Object): Promise<VotingDto | null> {
    console.log(options);

    return this.repository.findOneBy({
      userUuid: 'userUuid'
    });
    // return this.repository.findOne({
    //   where: options
    // });
  }

}
