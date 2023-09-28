import { MigrationInterface, QueryRunner } from "typeorm";

export class updateDate1695720132825 implements MigrationInterface {
    name = 'updateDate1695720132825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookmarks" ("id" SERIAL NOT NULL, "userUuid" character varying NOT NULL, "linkUuid" character varying NOT NULL, CONSTRAINT "PK_7f976ef6cecd37a53bd11685f32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "links" ADD "updateDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links" DROP COLUMN "updateDate"`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
    }

}
