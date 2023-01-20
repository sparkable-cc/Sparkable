import { Link } from '../models/Link';
import { LinkDto } from '../models/LinkDto';

export interface LinkRepository {
  getAllLinks: (
    sort?: string,
    categories?: string,
  ) => Promise<[LinkDto[], number]>;
  storeLink: (link: Link) => void;
}
