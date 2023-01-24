import { CategoryRepository } from "../domain/repositories/CategoryRepository";

export class GetAllCategoriesAction {
    categoryRepository:CategoryRepository;

    constructor(categoryRepository:CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    execute() {
        return this.categoryRepository.getAllLinks();
    }

}