import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, PrimaryColumn, OneToMany } from "typeorm"
import { UserDto } from "../../../domain/models/UserDto";
import { BookmarkEntity } from "../../../../bookmarks/infrastructure/persistence/entities/BookmarkEntity";

@Entity('users')
export class UserEntity implements UserDto {
  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @PrimaryColumn()
  uuid: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  registrationDate: Date;

  @Column({ nullable: true })
  stage: number;

  @OneToMany(() => BookmarkEntity, bookmark => bookmark.user)
  public bookmark: BookmarkEntity[];
}