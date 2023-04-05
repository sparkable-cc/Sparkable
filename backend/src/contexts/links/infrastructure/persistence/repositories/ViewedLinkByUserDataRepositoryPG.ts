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
    const dataDto = data.toDto();
    const params = {
      userUuid: dataDto.userUuid,
      linkUuid: dataDto.linkUuid
    };

    if (await this.findData(params)) {
      await this.repository.update(params, {voted: dataDto.voted});
    } else {
      const dataEntity = this.repository.create(dataDto);
      await this.repository.insert(dataEntity);
    }
  }

  async findData(params: Object): Promise<ViewedLinkByUserDataDto | null> {
    return await this.repository.findOneBy(params);
  }

  async getAllData(params: Object): Promise<[ViewedLinkByUserDataDto[], number]> {
    return await this.repository.findAndCount({ where:params });
  }

  async getAllDataByUserByCycleNotVoted(
    userUuid: string,
    cycle: number
  ): Promise<ViewedLinkByUserDataDto[]> {
    return await this.repository.find({
      where: {
        userUuid: userUuid,
        cycle: cycle,
        voted: false
      },
    });
  }
}
