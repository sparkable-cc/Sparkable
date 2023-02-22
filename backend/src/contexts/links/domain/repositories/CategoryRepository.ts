import { CategoryDto } from "../models/CategoryDto";

export interface CategoryRepository {
    getAllLinks: () =>  Promise<[CategoryDto[], number]>;
    findCategoryById: (id: number) => Promise<CategoryDto | null>
}