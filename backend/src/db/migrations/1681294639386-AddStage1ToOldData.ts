import { MigrationInterface, QueryRunner } from "typeorm"
import dataSource from "../../data-source";
import { UserEntity } from "../../contexts/users/infrastructure/persistence/entities/UserEntity";
import { LinkEntity } from "../../contexts/links/infrastructure/persistence/entities/LinkEntity";
import { ViewedLinkByUserDataEntity } from "../../contexts/links/infrastructure/persistence/entities/ViewedLinkByUserDataEntity";

export class AddStage1ToOldData1681294639386 implements MigrationInterface {

  userRepository = dataSource.getRepository(UserEntity);
  linkRepository = dataSource.getRepository(LinkEntity);
  dataRepository = dataSource.getRepository(ViewedLinkByUserDataEntity);

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.userRepository.update({}, { stage: 1 });
    await this.linkRepository.update({}, { stage: 1 });
    await this.dataRepository.update({}, { cycle: 1, linkStage: 1, userStage:1 });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

  }

}
