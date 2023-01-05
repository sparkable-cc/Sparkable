import { CategoryEntity } from "../contexts/links/infrastructure/persistence/entities/CategoryEntity";
import { LinkEntity } from "../contexts/links/infrastructure/persistence/entities/LinkEntity";
import dataSource from "../data-source"

export default class LinkFactory {

    private static readonly linkDto = {
        title: 'title',
        username: 'admin',
        link: 'https://www.butterfy.me/',
        image: 'https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/5fe2726881e6e52053a0217c_Butterfy_Logo-p-500.png',
        categories: []
    };

    // REFACTOR BY PARAMS
    public static async create() {
        const linkRepository = dataSource.getRepository(LinkEntity);
        const link = linkRepository.create({ ...this.linkDto });
        return await linkRepository.manager.save(link);
    }

    // REFACTOR BY PARAMS
    public static async createWithCategories(categories:Array<CategoryEntity>) {
        const linkRepository = dataSource.getRepository(LinkEntity);
        const link = linkRepository.create({ ...this.linkDto });
        link.categories = categories;
        await linkRepository.manager.save(link);
    }

    public static async createX(x:number) {
        for (let index = 0; index < x; index++) {
            await LinkFactory.create();
        }
    }

    public static async createXWithCategories(x:number, categories:Array<CategoryEntity>) {
        for (let index = 0; index < x; index++) {
            await LinkFactory.createWithCategories(categories);
        }
    }

    /////////////////////7

    // public static create(title?:string) {
    //     let link = { ...this.linkDto };
    //     if (title) link.title = title;
    //     return link;
    // }

    // public static createX(x:number) {
    //     const links = [];
    //     for (let index = 0; index < x; index++) {
    //         let newLink = { ...this.linkDto };
    //         newLink.title = newLink.title + index;
    //         links.push(newLink);
    //     }

    //     return links;
    // }

}