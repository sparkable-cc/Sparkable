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

  @Column({type: "text", nullable: true})
  description: string;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @Column({nullable: true})
  userUuid: string;

  @Column({nullable: true})
  username: string;

  @Column({type: "text", nullable: true})
  statement: string;

  @Column({type: "text", nullable: true})
  suggestionCategory: string;

  @ManyToMany(() => CategoryEntity, (category) => category.links, {
    eager: true,
    cascade: ["insert"],
  })
  @JoinTable()
  categories: CategoryEntity[];

  @Column({nullable: true})
  stage: number;
}
