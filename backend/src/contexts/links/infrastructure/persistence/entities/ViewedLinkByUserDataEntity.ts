import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ViewedLinkByUserDataDto } from '../../../domain/models/ViewedLinkByUserDataDto';

@Entity('viewed_links_by_user')
export class ViewedLinkByUserDataEntity implements ViewedLinkByUserDataDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userUuid: string;

  @Column()
  linkUuid: string;

  @Column({ nullable: true })
  stage: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;
}
