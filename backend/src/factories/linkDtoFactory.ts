
export class LinkDtoFactory {

    private static readonly linkDto = {
        title: 'title',
        username: 'admin',
        link: 'https://www.butterfy.me/',
        image: 'https://uploads-ssl.webflow.com/5fe2721ea6fb441f47d88866/5fe2726881e6e52053a0217c_Butterfy_Logo-p-500.png',
        categories: 'environment'
    };

    public static create(title?:string) {
        let link = { ...this.linkDto };
        if (title) link.title = title;
        return link;
    }

    public static createX(x:number) {
        const links = [];
        for (let index = 0; index < x; index++) {
            let newLink = { ...this.linkDto };
            newLink.title = newLink.title + index;
            links.push(newLink);
        }

        return links;
    }

}