import { ErrorLog } from "../domain/models/ErrorLog";
import { ErrorLogRepository } from "../domain/repositories/ErrorLogRepository";

export class CreateErrorLogAction {
  private errorLogRepository: ErrorLogRepository;

  constructor(errorLogRepository: ErrorLogRepository
  ) {
    this.errorLogRepository = errorLogRepository;
  }

  async execute(error: any) {
    await this.errorLogRepository.storeErrorLog(new ErrorLog(error));
  }

}