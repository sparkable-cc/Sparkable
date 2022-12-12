import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { UserDto } from "../../../domain/models/UserDto";

@Entity('users')
export class UserEntity implements UserDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    email: string;

    @Column({ unique: true})
    username: string;

    @Column()
    password: string;
}