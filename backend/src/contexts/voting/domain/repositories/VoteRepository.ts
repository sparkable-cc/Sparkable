import { Voting } from "../models/Voting";
import { VotingDto } from "../models/VotingDto";

export interface VoteRepository {
  storeVote: (vote:Voting) => Promise<VotingDto>
}