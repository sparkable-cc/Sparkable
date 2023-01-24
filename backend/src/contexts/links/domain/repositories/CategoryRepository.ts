import { CategoryDto } from "../models/CategoryDto";

export interface CategoryRepository {
    getAllLinks: () =>  Promise<[CategoryDto[], number]>
}