import { LinkRepository } from '../domain/repositories/LinkRepository';

export class GetLinkByIdAction {
    linkRepository:LinkRepository;

    constructor(linkRepository:LinkRepository) {
        this.linkRepository = linkRepository;
    }

    execute(id:number) {
        return this.linkRepository.getLinkById(id);
    }

}