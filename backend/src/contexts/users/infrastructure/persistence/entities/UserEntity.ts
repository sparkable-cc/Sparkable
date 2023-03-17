import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"
import { UserDto } from "../../../domain/models/UserDto";

@Entity('users')
export class UserEntity implements UserDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({nullable: true})
  uuid: string;

  @Column({nullable: true})
  cycle: number;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  registrationDate: Date;
}