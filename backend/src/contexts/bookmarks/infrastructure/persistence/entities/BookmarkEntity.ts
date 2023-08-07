import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { BookmarkDto } from "../../../domain/models/BookmarkDto";
import { UserEntity } from "../../../../users/infrastructure/persistence/entities/UserEntity";
import { LinkEntity } from "../../../../links/infrastructure/persistence/entities/LinkEntity";

@Entity('bookmarks')
export class BookmarkEntity implements BookmarkDto {
  @PrimaryColumn()
  userUuid: string;

  @PrimaryColumn()
  linkUuid: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.bookmark)
  @JoinColumn([{ name: 'userUuid', referencedColumnName: 'uuid' }])
  public user: UserEntity

  @ManyToOne(() => LinkEntity, (link) => link.bookmark)
  @JoinColumn([{ name: 'linkUuid', referencedColumnName: 'uuid' }])
  public link: LinkEntity
}