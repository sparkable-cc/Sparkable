import { CategoryDto } from './CategoryDto';

export interface LinkDto {
  id: number;
  uuid: string;
  title: string;
  username: string;
  url: string;
  image: string;
  description: string;
  date: Date;
  categories: Array<CategoryDto>;
  userUuid: string;
}
