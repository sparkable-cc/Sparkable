import { Submission } from '../domain/models/Submission';
import { submissionRepository } from '../domain/repositories/SubmissionRepository';

export class SubmitLinkAction {
  submissionRepository: submissionRepository;

  constructor(submissionRepository: submissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async execute(submission: Submission) {
    this.submissionRepository.storeSubmission(submission);
  }
}
