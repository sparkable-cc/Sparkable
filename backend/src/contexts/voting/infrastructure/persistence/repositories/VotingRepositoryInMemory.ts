import { Voting } from "../../../domain/models/Voting";
import { VotingDto } from "../../../domain/models/VotingDto";
import { VotingRepository } from "../../../domain/repositories/VotingRepository";

export class VotingRepositoryInMemory implements VotingRepository {

  voting: VotingDto[];

  constructor() {
    this.voting = [];
  }

  storeVoting(voting: Voting): Promise<VotingDto> {
    const votingDto = voting.toDto();
    this.voting.push(votingDto);

    return new Promise((resolve) => resolve(votingDto));
  }

  getAllVotings(): Promise<VotingDto[] | null> {
    return new Promise((resolve) => resolve(this.voting));
  }

  findVoting(options: Object): Promise<VotingDto | null> {
    return new Promise((resolve) => resolve(this.voting[0]));
  }

}
