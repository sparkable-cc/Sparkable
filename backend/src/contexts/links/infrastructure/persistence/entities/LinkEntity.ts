import { Entity, Column, PrimaryGeneratedColumn, Generated, CreateDateColumn, ManyToMany, JoinTable} from "typeorm"
import { LinkDto } from "../../../domain/models/LinkDto";
import { CategoryEntity } from "./CategoryEntity"

@Entity('links')
export class LinkEntity implements LinkDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated("uuid")
    uuid: string;

    @Column()
    title:string;

    @Column()
    link:string;

    @Column()
    image:string;

    @CreateDateColumn({ type: 'timestamptz' })
    date: Date;

    @Column()
    username:string;

    //@ManyToMany(() => CategoryEntity, {cascade: true, onDelete: 'CASCADE'})
    @ManyToMany(() => CategoryEntity)
    @JoinTable()
    categories: CategoryEntity[]
}