import { CategoryDto } from '../../../domain/models/CategoryDto';
import { CategoryRepository } from '../../../domain/repositories/CategoryRepository';

export class CategoryRepositoryInMemory implements CategoryRepository {
  categories: CategoryDto[];

  constructor(initArray:CategoryDto[]=[]) {
    this.categories = initArray;
  }

  getAllLinks(): Promise<[CategoryDto[], number]> {
    return new Promise((resolve) => resolve([this.categories, this.categories.length]));
  }

  findCategoryById(id: number): Promise<CategoryDto | null> {
    const category = this.categories.find((category) => {
      let key = 'id' as keyof CategoryDto;
      return category[key] === id;
    });
    if (category) {
      return new Promise((resolve) => resolve(category));
    } else {
      return new Promise((resolve) => resolve(null));
    }
  }

  save(categoryDto: CategoryDto) {
    this.categories.push(categoryDto);
  }

}