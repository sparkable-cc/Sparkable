import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm"
import { CategoryDto } from "../../../domain/models/CategoryDto";
import { LinkEntity } from "./LinkEntity";

@Entity('categories')
export class CategoryEntity implements CategoryDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() //UNIQUE
    name:string;

    @ManyToMany((type) => LinkEntity, (link) => link.categories)
    links: LinkEntity[];
}