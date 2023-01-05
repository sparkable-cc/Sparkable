import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
import { CategoryDto } from "../../../domain/models/CategoryDto";

@Entity('categories')
export class CategoryEntity implements CategoryDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //UNIQUE
    name:string;
}