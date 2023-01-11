import { Submission } from '../models/Submission';

export interface submissionRepository {
  storeSubmission(submission: Submission): void;
}
