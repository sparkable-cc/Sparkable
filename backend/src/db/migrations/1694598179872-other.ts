import { MigrationInterface, QueryRunner } from "typeorm";

export class errorLog1694598179872 implements MigrationInterface {
  name = 'errorLog1694598179872'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "errors" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "url" character varying NOT NULL, "userUuid" character varying, CONSTRAINT "PK_f1ab2df89a11cd21f48ff90febb" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "errors"`);
  }

}
