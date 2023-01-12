import { MigrationInterface, QueryRunner } from "typeorm"
import CategoryFactory from "../../factories/CategoryFactory";

export class CreateCategoriesByDefault1671100525151 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await CategoryFactory.create('Art & Culture');
        await CategoryFactory.create('Business & Economy');
        await CategoryFactory.create('Environment');
        await CategoryFactory.create('Mind & Body');
        await CategoryFactory.create('Society');
        await CategoryFactory.create('Technology');
        await CategoryFactory.create('Other');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('TRUNCATE categories');
    }

}
