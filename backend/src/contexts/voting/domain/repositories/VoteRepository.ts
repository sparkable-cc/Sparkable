import { Vote } from "../models/Vote";
import { VoteDto } from "../models/VoteDto";

export interface VoteRepository {
  storeVote: (vote:Vote) => Promise<VoteDto>;
  getAllVotes:(options?: Object) => Promise<[VoteDto[], number]>;
}