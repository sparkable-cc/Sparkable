import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm"
import { BookmarkDto } from "../../../domain/models/BookmarkDto";
import { UserEntity } from "../../../../users/infrastructure/persistence/entities/UserEntity";

@Entity('bookmarks')
export class BookmarkEntity implements BookmarkDto {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userUuid: string;

  @Column()
  linkUuid: string;

  @ManyToOne(() => UserEntity, (user) => user.bookmark)
  @JoinColumn([{ name: 'userUuid', referencedColumnName: 'uuid' }])
  public user: UserEntity
}