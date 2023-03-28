import { DataSource } from 'typeorm';
import { ViewedLinkByUserData } from '../../../domain/models/ViewedLinkByUserData';
import { ViewedLinkByUserDataDto } from '../../../domain/models/ViewedLinkByUserDataDto';
import { ViewedLinkByUserDataRepository } from '../../../domain/repositories/ViewedLinkByUserDataRepository';
import { ViewedLinkByUserDataEntity } from '../entities/ViewedLinkByUserDataEntity';

export class ViewedLinkByUserDataRepositoryPG
  implements ViewedLinkByUserDataRepository
{
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

  async getAllDataByUserUuid(
    userUuid: string,
  ): Promise<ViewedLinkByUserDataDto[]> {
    return await this.repository.find({
      where: { userUuid: userUuid },
    });
  }
}
