import { MigrationInterface, QueryRunner } from "typeorm"
import dataSource from "../../data-source";
import { CategoryEntity } from "../../contexts/links/infrastructure/persistence/entities/CategoryEntity";

export class SlugToCategories1674495131975 implements MigrationInterface {

    categoryRepository = dataSource.getRepository(CategoryEntity);

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.addSlugToCategory('art-and-culture', 'Art & Culture');
        await this.addSlugToCategory('business-and-economy', 'Business & Economy');
        await this.addSlugToCategory('environment', 'Environment');
        await this.addSlugToCategory('mind-and-body', 'Mind & Body');
        await this.addSlugToCategory('society', 'Society');
        await this.addSlugToCategory('technology', 'Technology');
        await this.addSlugToCategory('other', 'Other');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

    private async addSlugToCategory(slug:string, name:string) {
        let category = await this.categoryRepository.findOneBy({name:name});
        if (category) {
            category.slug = slug;
            await this.categoryRepository.save(category);
        }
    }

}
