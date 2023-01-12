import { MigrationInterface, QueryRunner } from "typeorm"
import { CategoryEntity } from "../../contexts/links/infrastructure/persistence/entities/CategoryEntity";
import dataSource from "../../data-source";
import CategoryFactory from "../../factories/CategoryFactory";
import LinkFactory from "../../factories/LinkFactory";

export class CreateFakeLinks1671100525152 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const categoryRepository = dataSource.getRepository(CategoryEntity);

        const technologyCategory = await categoryRepository.findOneBy({name:'Technology'});
        const societyCategory = await categoryRepository.findOneBy({name:'Society'});
        const environmentCategory = await categoryRepository.findOneBy({name:'Environment'});

        if (technologyCategory) {
            await LinkFactory.createX(2, [technologyCategory]);
        }
        if (societyCategory) {
            await LinkFactory.createX(2, [societyCategory]);
        }
        if (environmentCategory) {
            await LinkFactory.createX(2, [environmentCategory]);
        }
        if (environmentCategory && technologyCategory) {
            await LinkFactory.createX(2, [environmentCategory, technologyCategory]);
        }
        if (societyCategory && technologyCategory) {
            await LinkFactory.createX(2, [societyCategory, technologyCategory]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('TRUNCATE links CASCADE');
    }

}
