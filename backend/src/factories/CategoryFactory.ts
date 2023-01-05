import { CategoryEntity } from "../contexts/links/infrastructure/persistence/entities/CategoryEntity";
import dataSource from "../data-source"

export default class CategoryFactory {

    public static async create(name:string): Promise<CategoryEntity> {
        const categoryRepository = dataSource.getRepository(CategoryEntity);
        const category = new CategoryEntity();
        category.name = name;
        await categoryRepository.save(category);

        return category;
    }

}