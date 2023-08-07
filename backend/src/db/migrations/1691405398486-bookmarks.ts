import { MigrationInterface, QueryRunner } from "typeorm";

export class bookmarks1691405398486 implements MigrationInterface {
    name = 'bookmarks1691405398486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP CONSTRAINT "FK_7cd6a2b94078a0e63d23fb8478e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7cd6a2b94078a0e63d23fb8478"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" RENAME COLUMN "linksId" TO "linksUuid"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" RENAME CONSTRAINT "PK_bf7d2acc9483bd20130d90bd302" TO "PK_4575d2f3a23f99039884c96e08e"`);
        await queryRunner.query(`CREATE TABLE "bookmarks" ("userUuid" character varying NOT NULL, "linkUuid" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c3cf4eda3fccbf057483c5c9571" PRIMARY KEY ("userUuid", "linkUuid"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6"`);
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "uuid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "PK_49cbbe6fd1f5b2787c050ed5e10" PRIMARY KEY ("uuid")`);
        await queryRunner.query(`ALTER TABLE "stage_movements_links" ALTER COLUMN "linkUuid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP CONSTRAINT "PK_4575d2f3a23f99039884c96e08e"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD CONSTRAINT "PK_c4174a618238722ac3f487d6758" PRIMARY KEY ("categoriesId")`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP COLUMN "linksUuid"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD "linksUuid" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP CONSTRAINT "PK_c4174a618238722ac3f487d6758"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD CONSTRAINT "PK_4575d2f3a23f99039884c96e08e" PRIMARY KEY ("categoriesId", "linksUuid")`);
        await queryRunner.query(`CREATE INDEX "IDX_d34e24a1730c14c4b1c6c4c2aa" ON "links_categories_categories" ("linksUuid") `);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_2aa03c2bb864fc4e8fcd01bff08" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookmarks" ADD CONSTRAINT "FK_6361a765f881837847869542576" FOREIGN KEY ("linkUuid") REFERENCES "links"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD CONSTRAINT "FK_d34e24a1730c14c4b1c6c4c2aa0" FOREIGN KEY ("linksUuid") REFERENCES "links"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP CONSTRAINT "FK_d34e24a1730c14c4b1c6c4c2aa0"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_6361a765f881837847869542576"`);
        await queryRunner.query(`ALTER TABLE "bookmarks" DROP CONSTRAINT "FK_2aa03c2bb864fc4e8fcd01bff08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d34e24a1730c14c4b1c6c4c2aa"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP CONSTRAINT "PK_4575d2f3a23f99039884c96e08e"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD CONSTRAINT "PK_c4174a618238722ac3f487d6758" PRIMARY KEY ("categoriesId")`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP COLUMN "linksUuid"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD "linksUuid" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" DROP CONSTRAINT "PK_c4174a618238722ac3f487d6758"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD CONSTRAINT "PK_4575d2f3a23f99039884c96e08e" PRIMARY KEY ("linksUuid", "categoriesId")`);
        await queryRunner.query(`ALTER TABLE "stage_movements_links" ALTER COLUMN "linkUuid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" DROP CONSTRAINT "PK_49cbbe6fd1f5b2787c050ed5e10"`);
        await queryRunner.query(`ALTER TABLE "links" ALTER COLUMN "uuid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "links" ADD CONSTRAINT "PK_ecf17f4a741d3c5ba0b4c5ab4b6" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "uuid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`);
        await queryRunner.query(`DROP TABLE "bookmarks"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" RENAME CONSTRAINT "PK_4575d2f3a23f99039884c96e08e" TO "PK_bf7d2acc9483bd20130d90bd302"`);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" RENAME COLUMN "linksUuid" TO "linksId"`);
        await queryRunner.query(`CREATE INDEX "IDX_7cd6a2b94078a0e63d23fb8478" ON "links_categories_categories" ("linksId") `);
        await queryRunner.query(`ALTER TABLE "links_categories_categories" ADD CONSTRAINT "FK_7cd6a2b94078a0e63d23fb8478e" FOREIGN KEY ("linksId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
