import { Any, DataSource } from 'typeorm';
import { Link } from '../../../domain/models/Link';
import { LinkDto } from '../../../domain/models/LinkDto';
import { ViewedLinkByUserData } from '../../../domain/models/ViewedLinkByUserData';
import { ViewedLinkByUserDataDto } from '../../../domain/models/ViewedLinkByUserDataDto';
import { LinkRepository } from '../../../domain/repositories/LinkRepository';
import { LinkEntity } from '../entities/LinkEntity';

export class LinkRepositoryPG implements LinkRepository {
  private repository;

  readonly PAGINATION = 6;
  readonly LIMIT_TO_RANDOM = 20;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(LinkEntity);
  }

  async getAllLinks(
    sort?: string,
    categories?: string,
    page?: number,
  ): Promise<[LinkDto[], number]> {
    let query: Record<string, any> = {};

    const categoriesToFilter = categories?.split(',');
    query = this.addQueryFilterByCategories(categoriesToFilter, query);

    if (sort) {
      return await this.findSortingByDate(query, page);
    } else {
      return await this.findSortingRandom(query);
    }
  }

  async getLinkById(id: number): Promise<LinkDto | null> {
    return this.repository.findOneBy({ id: id });
  }

  async storeLink(link: Link): Promise<LinkDto> {
    let linkDto = link.toDto();
    const linkEntity = this.repository.create(linkDto);
    return this.repository.save(linkEntity);
  }

  async findLink(field: string, value: string): Promise<LinkDto | null> {
    return await this.repository.findOne({
      where: { [field]: value },
      relations: ['categories'],
    });
  }

  private addQueryFilterByCategories(
    categoriesToFilter: string[] | undefined,
    query: Record<string, any>,
  ) {
    if (categoriesToFilter) {
      const categoriesFilter: { categories: { slug: string } }[] = [];
      categoriesToFilter.forEach((category) => {
        categoriesFilter.push({ categories: { slug: category } });
      });

      query.relations = { categories: true };
      query.where = categoriesFilter;
    }

    return query;
  }

  private async findSortingByDate(
    query: Record<string, any>,
    page?: number,
  ): Promise<[LinkDto[], number]> {
    query.order = { date: 'DESC' };
    query.take = this.PAGINATION;

    if (page) {
      query.skip = (page - 1) * this.PAGINATION;
    }

    return await this.repository.findAndCount(query);
  }

  private async findSortingRandom(
    query: Record<string, any>,
  ): Promise<[LinkDto[], number]> {
    const result = await this.repository.findAndCount(query);
    //improve this in the future... poor performance with lots of data
    this.shuffle(result[0]);
    result[0] = result[0].slice(0, this.LIMIT_TO_RANDOM);
    return result;
  }

  private shuffle(array: any) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  async findLinks(field: string, values: string[]): Promise<LinkDto[]> {
    return await this.repository.find({
      where: { [field]: Any(values) },
      relations: ['categories'],
    });
  }

  store: (data: ViewedLinkByUserData) => void;
  findData: (params: Object) => Promise<ViewedLinkByUserDataDto | null>;
  getAllDataByUserUuid: (
    userUuid: string,
  ) => Promise<ViewedLinkByUserDataDto[]>;
}
