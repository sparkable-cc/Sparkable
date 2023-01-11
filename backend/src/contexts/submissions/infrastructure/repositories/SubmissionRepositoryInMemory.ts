import { Submission } from '../../domain/models/Submission';
import { submissionRepository } from '../../domain/repositories/SubmissionRepository';

export interface SubmissionRepository {
  submissions: Submission[];

  constructor() {
    this.submissions = [];
  };

  storeSubmission(submission:Submission) {
    this.submissions.push(submission);
  };

}