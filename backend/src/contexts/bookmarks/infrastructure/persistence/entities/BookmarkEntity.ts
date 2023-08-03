import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { BookmarkDto } from "../../../domain/models/BookmarkDto";

@Entity('bookmarks')
export class BookmarkEntity implements BookmarkDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() //UNIQUE
  uuid:string;

  @Column()
  userUuid: string;

  @Column()
  linkUuid: string;
}