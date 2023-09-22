import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { ErrorLogDto } from "../../../domain/models/dtos/ErrorLogDto";

@Entity('errors')
export class ErrorLogEntity implements ErrorLogDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  message: string;

  @Column({nullable: false})
  url: string;

  @Column({nullable: true})
  userUuid: string;
}