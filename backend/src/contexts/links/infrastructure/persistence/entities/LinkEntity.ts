import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn
} from 'typeorm';
import { LinkDto } from '../../../domain/models/LinkDto';
import { CategoryEntity } from './CategoryEntity';
import { BookmarkEntity } from '../../../../bookmarks/infrastructure/persistence/entities/BookmarkEntity';

@Entity('links')
export class LinkEntity implements LinkDto {
  @Column()
  @Generated('increment')
  id: number;

  @PrimaryColumn()
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

  @Column({nullable: true, default: 1})
  stage: number;

  @OneToMany(() => BookmarkEntity, bookmark => bookmark.user)
  public bookmark: BookmarkEntity[];
}
