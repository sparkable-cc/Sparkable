import { MandatoryFieldEmptyException } from '../../../users/domain/exceptions/MandatoryFieldEmptyException';
import { CategoryDto } from './CategoryDto';
import { LinkDto } from './LinkDto';

export class Link {
  title: string;
  link: string;
  categories: string[];

  constructor(link: LinkDto) {
    if (Object.keys(link).length === 0) {
      throw new MandatoryFieldEmptyException();
    }

    this.title = link.title;
    this.link = link.link;
    this.categories = this.categories;
  }

  public toDto(): LinkDto {
    return {
      id: 0,
      uuid: '1234-1234-1234',
      title: this.title,
      username: '',
      link: this.link,
      image: '',
      date: new Date(),
      categories:Array<CategoryDto>;
    };
  }
}
