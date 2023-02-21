import { CategoryEntity } from "../contexts/links/infrastructure/persistence/entities/CategoryEntity";
import dataSource from "../data-source"

export default class CategoryFactory {

    public static async create(name:string, slug?:string): Promise<CategoryEntity> {
        const categoryRepository = dataSource.getRepository(CategoryEntity);
        const category = new CategoryEntity();
        category.name = name;

        if(slug) {
            category.slug = slug
        }

        return await categoryRepository.save(category);
    }

}