import { VoteDto } from "../models/VoteDto";

export interface VoteRepository {
  storeVote: (vote:Vote) => Promise<VoteDto>
}