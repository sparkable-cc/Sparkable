import { CategoryDto } from '../../links/domain/models/CategoryDto';

export interface SubmissionDto {
  id: string;
  uuid: string;
  title: string;
  username: string;
  link: string;
  image: string;
  date: Date;
  categories: Array<CategoryDto>;
}
