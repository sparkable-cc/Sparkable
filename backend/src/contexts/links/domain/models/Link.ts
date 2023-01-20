import { MandatoryFieldEmptyException } from '../../../users/domain/exceptions/MandatoryFieldEmptyException';
import { CategoryDto } from './CategoryDto';
import { LinkDto } from './LinkDto';

export class Link {
  // title: string;
  // link: string;
  // categories: string[];

  id: number;
  uuid: string;
  title: string;
  username: string;
  link: string;
  image: string;
  description: string;
  date: Date;
  categories: string[];

  constructor(link: LinkDto) {
    if (Object.keys(link).length === 0) {
      throw new MandatoryFieldEmptyException();
    }

    this.title = link.title;
    this.link = link.link;
    this.categories = this.categories;
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
      image: 'http://test.com/test.jpg',
      description: '',
      date: new Date(),
      categories: [{ id: 0, name: 'Environment' }],
    };
  }
}
