import { LinkDto } from '../models/LinkDto';

export interface LinkRepository {
    getAllLinks: (sort?:string) =>  Promise<[LinkDto[], number]>
}