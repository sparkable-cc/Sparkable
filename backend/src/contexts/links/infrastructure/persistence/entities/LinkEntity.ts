import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LinkDto } from '../../../domain/models/LinkDto';
import { CategoryEntity } from './CategoryEntity';

@Entity('links')
export class LinkEntity implements LinkDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  uuid: string;

  @Column()
  title: string;

  @Column({nullable: true})
  url: string;

  @Column({nullable: true})
  image: string;

  @Column({nullable: true})
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @Column({nullable: true})
  username: string;

  //@ManyToMany(() => CategoryEntity, (category) => category.links, {
  @ManyToMany(() => CategoryEntity, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  categories: CategoryEntity[];
}
