import { DataSource } from 'typeorm';
import { ErrorLogRepository } from '../../../domain/repositories/ErrorLogRepository';
import { ErrorLog } from '../../../domain/models/ErrorLog';
import { ErrorLogEntity } from '../entities/ErrorLogEntity';

export class ErrorLogRepositoryPG implements ErrorLogRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(ErrorLogEntity);
  }

  async storeErrorLog(errorLog: ErrorLog): Promise<void> {
    await this.repository.insert(errorLog.toDto());
  }

}