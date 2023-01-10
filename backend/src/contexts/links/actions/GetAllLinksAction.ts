import { LinkRepository } from '../domain/repositories/LinkRepository';

export class GetAllLinksAction {
    linkRepository:LinkRepository;

    constructor(linkRepository:LinkRepository) {
        this.linkRepository = linkRepository;
    }

    execute(sort?:string, categories?:string) {
        return this.linkRepository.getAllLinks(sort, categories);
    }

}