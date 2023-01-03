import { LinkRepository } from '../../../domain/repositories/LinkRepository';
import { LinkEntity } from '../entities/LinkEntity';
import { DataSource } from 'typeorm';
import { LinkDto } from '../../../domain/models/LinkDto';


export class LinkRepositoryPG implements LinkRepository {
    private repository;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(LinkEntity);
    }

    async getAllLinks(sort?:string): Promise<[LinkDto[], number]> {
        if (sort) {
            return await this.repository.findAndCount({order:{date:"DESC"}});
        } else {
            const result = await this.repository.createQueryBuilder('links').select().orderBy('RANDOM()').take(20).getMany();
            return new Promise((resolve) => resolve([result, result.length]));
        }
    }
}