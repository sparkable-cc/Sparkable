import { CategoryDto } from "./CategoryDto";

export interface LinkDto  {
    id:number;
    uuid:string;
    title:string;
    username:string;
    link:string;
    image:string;
    date: Date;
    categories:Array<CategoryDto>;
}