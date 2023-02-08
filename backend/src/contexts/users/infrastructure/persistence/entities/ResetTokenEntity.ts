import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { ResetTokenDto } from "../../../domain/models/ResetTokenDto";

@Entity('tokens')
export class ResetTokenEntity implements ResetTokenDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    token: string;

    @Column()
    createdAt: Date;
}