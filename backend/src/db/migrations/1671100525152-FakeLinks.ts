import { MigrationInterface, QueryRunner } from "typeorm"
import LinkFactory from "../../factories/LinkFactory";

export class FakeLinks1671100525152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const linksDto = LinkFactory.createX(10);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('TRUNCATE links');
    }

}
