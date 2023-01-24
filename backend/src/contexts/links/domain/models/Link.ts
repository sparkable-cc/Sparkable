import { MandatoryFieldEmptyException } from '../../../users/domain/exceptions/MandatoryFieldEmptyException';
import { CategoryRestrictionException } from '../exceptions/CategoryRestrictionException';
import { CategoryDto } from './CategoryDto';
import { LinkDto } from './LinkDto';

export class Link {
  id: number;
  uuid: string;
  title: string;
  username: string;
  link: string;
  image: string;
  description: string;
  date: Date;
  categories: CategoryDto[];

  constructor(link: LinkDto) {
    if (Object.keys(link).length === 0) {
      throw new MandatoryFieldEmptyException();
    }

    if (!link.title || !link.link || !link.categories) {
      throw new MandatoryFieldEmptyException();
    }

    if (link.categories.length > 2) {
      throw new CategoryRestrictionException();
    }

    this.title = link.title;
    this.link = link.link;
    this.categories = link.categories;
  }

  public static factory(linkDto: LinkDto): Link {
    return new Link(linkDto);
  }

  public toDto(): LinkDto {
    return {
      id: 0,
      uuid: '1234-1234-1234',
      title: this.title,
      username: '',
      link: this.link,
      image: 'http://image',
      description: '',
      date: new Date(),
      categories: this.categories,
    };
  }
}
