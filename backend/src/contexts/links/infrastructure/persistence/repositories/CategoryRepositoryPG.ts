import { DataSource } from 'typeorm';
import { CategoryDto } from '../../../domain/models/CategoryDto';
import { CategoryRepository } from '../../../domain/repositories/CategoryRepository';
import { CategoryEntity } from '../entities/CategoryEntity';

export class CategoryRepositoryPG implements CategoryRepository {
  private repository;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(CategoryEntity);
  }

  async getAllLinks(sort?:string, categories?:string): Promise<[CategoryDto[], number]> {
    return await this.repository.findAndCount();
  }

  findCategoryById(id: number): Promise<CategoryDto | null> {
    return this.repository.findOneBy({id:id});
  }

}