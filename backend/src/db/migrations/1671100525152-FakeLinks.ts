import { MigrationInterface, QueryRunner } from "typeorm"
import { LinkEntity } from "../../contexts/links/infrastructure/persistence/entities/LinkEntity";
import LinkFactory from "../../factories/LinkFactory";

export class FakeLinks1671100525152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const linksDto = LinkFactory.createX(10);

        linksDto.forEach( async linkDto => {
            await queryRunner.manager.save(
                queryRunner.manager.create<LinkEntity>(LinkEntity,linkDto)
            );
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('TRUNCATE links');
    }

}
