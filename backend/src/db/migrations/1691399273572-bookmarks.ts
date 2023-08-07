import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmarks1691399273572 implements MigrationInterface {
    name = 'bookmarks1691399273572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookmarks" ("userUuid" character varying NOT NULL, "linkUuid" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2aa03c2bb864fc4e8fcd01bff08" PRIMARY KEY ("userUuid"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "stage_movements_links" ALTER COLUMN "linkUuid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_2aa03c2bb864fc4e8fcd01bff08" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_2aa03c2bb864fc4e8fcd01bff08"`);
        await queryRunner.query(`ALTER TABLE "stage_movements_links" ALTER COLUMN "linkUuid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
    }

}
