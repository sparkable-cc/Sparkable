/* eslint-disable */

export declare namespace ApiTypes.Model {
  interface Link {
    id: number,
    uuid: string,
    title: string,
    link: string,
    image: string,
    date: Date
    username: string
  }

  interface Category {
    id: number
    name: string,
    slug: string
  }
}

export declare namespace ApiTypes.Req {

  interface LinksQueryParams {
    sort?: "-date",
    categories?: string[]
  }
}

export declare namespace ApiTypes.Res {
  interface Links {
    links: ApiTypes.Model.Link[],
    total: number
  }


  interface Categories {
    categories: ApiTypes.Model.Category[]
  }
}
