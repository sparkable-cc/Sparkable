import { ViewedLinkByUserDataDto } from '../contexts/links/domain/models/ViewedLinkByUserDataDto';
import { ViewedLinkByUserDataEntity } from '../contexts/links/infrastructure/persistence/entities/ViewedLinkByUserDataEntity';
import dataSource from '../data-source';

export default class ViewedLinkByUserDataFactory {

  public static async store(
    params: { userUuid: string; linkUuid: string; cycle: number; voted?: boolean }
  ): Promise<ViewedLinkByUserDataDto> {
    const viewLinkByUserDataRepository = dataSource.getRepository(ViewedLinkByUserDataEntity);
    return await viewLinkByUserDataRepository.save({
      userUuid: params.userUuid,
      linkUuid: params.linkUuid,
      cycle: params.cycle,
      userStage: 1,
      linkStage: 1,
      voted: params.voted || false
    });

  }

}