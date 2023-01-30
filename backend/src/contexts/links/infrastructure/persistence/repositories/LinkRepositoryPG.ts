import { LinkRepository } from '../../../domain/repositories/LinkRepository';
import { LinkEntity } from '../entities/LinkEntity';
import { DataSource, Any } from 'typeorm';
import { LinkDto } from '../../../domain/models/LinkDto';


export class LinkRepositoryPG implements LinkRepository {
    private repository;

    readonly LIMIT = 6;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(LinkEntity);
    }

    async getAllLinks(sort?:string, categories?:string): Promise<[LinkDto[], number]> {
        let query: Record<string, any> = {};

        const categoriesToFilter = categories?.split(',');
        query = this.addQueryFilterByCategories(categoriesToFilter, query);

        if (sort) {
            return await this.findSortingByDate(query);
        } else {
            return await this.findSortingRandom(query);
        }
    }

    async getLinkById(id:number): Promise<LinkDto | null> {
        return this.repository.findOneBy({id:id});
    }

    private addQueryFilterByCategories(categoriesToFilter: string[] | undefined, query: Record<string, any>) {
        if (categoriesToFilter) {
            const categoriesFilter: { categories: { slug: string; }; }[] = [];
            categoriesToFilter.forEach(category => {
                categoriesFilter.push({ categories: { slug: category } });
            });

            query.relations = { categories: true };
            query.where = categoriesFilter;
        }

        return query;
    }

    private async findSortingByDate(query: Record<string, any>): Promise<[LinkDto[], number]> {
        query.order = { date: "DESC" };
        query.take = this.LIMIT;

        return await this.repository.findAndCount(query);
    }

    private async findSortingRandom(query: Record<string, any>): Promise<[LinkDto[], number]> {
        const result = await this.repository.findAndCount(query);
        //improve this in the future... poor performance with lots of data
        this.shuffle(result[0]);
        result[0] = result[0].slice(0, this.LIMIT);
        return result;
    }

    private shuffle(array:any) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
      }
}