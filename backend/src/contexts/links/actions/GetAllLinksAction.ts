import { LinkRepository } from '../domain/repositories/LinkRepository';

export class GetAllLinksAction {
    linkRepository:LinkRepository;

    constructor(linkRepository:LinkRepository) {
        this.linkRepository = linkRepository;
    }

    execute() {
        return this.linkRepository.getAllLinks();
    }

}