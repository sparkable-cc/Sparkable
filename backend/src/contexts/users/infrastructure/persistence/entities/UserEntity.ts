import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column({length: 120})
    username: string;

    @Column()
    password: string;
}