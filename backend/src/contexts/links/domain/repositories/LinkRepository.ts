import { LinkDto } from '../models/LinkDto';

export interface LinkRepository {
    getAllLinks: () =>  Promise<[LinkDto[], number]>
}