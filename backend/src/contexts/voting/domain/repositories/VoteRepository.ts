import { VoteDto } from "../models/VoteDto";

export interface VoteRepository {
  findVote: (options:Object) => Promise<VoteDto | null>
}