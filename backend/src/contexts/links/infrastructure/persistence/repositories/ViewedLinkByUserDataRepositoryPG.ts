import { DataSource } from 'typeorm';
import { ViewedLinkByUserDataRepository } from '../../../domain/repositories/ViewedLinkByUserDataRepository';
import { ViewedLinkByUserData } from '../../../domain/models/ViewedLinkByUserData';
import { ViewedLinkByUserDataEntity } from '../entities/ViewedLinkByUserDataEntity';
import { ViewedLinkByUserDataDto } from '../../../domain/models/ViewedLinkByUserDataDto';


export class ViewedLinkByUserDataRepositoryPG implements ViewedLinkByUserDataRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(ViewedLinkByUserDataEntity);
  }

  async store(data: ViewedLinkByUserData) {
    const dataEntity = this.repository.create(data.toDto());
    await this.repository.save(dataEntity);
  }

  async findData(params: Object): Promise<ViewedLinkByUserDataDto | null> {
    return await this.repository.findOneBy(params);
  }

}