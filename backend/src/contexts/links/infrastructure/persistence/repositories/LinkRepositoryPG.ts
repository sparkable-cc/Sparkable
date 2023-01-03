import { LinkRepository } from '../../../domain/repositories/LinkRepository';
import { LinkEntity } from '../entities/LinkEntity';
import { DataSource } from 'typeorm';
import { LinkDto } from '../../../domain/models/LinkDto';


export class LinkRepositoryPG implements LinkRepository {
    private repository;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(LinkEntity);
    }

    async getAllLinks(): Promise<[LinkDto[], number]> {
        return await this.repository.findAndCount({order:{date:"DESC"}});
    }
}