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

  interface User {
    email: string
    username: string
    password: string
  }
}

export declare namespace ApiTypes.Req {

  interface LinksQueryParams {
    sort?: "-date",
    categories?: string[]
  }

  interface SignUp {
    email: string
    username: string
    password: string
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

  interface Article {
    id: number
    uuid: string
    title: string
    link: string
    image: string
    description?: string
    date: string
    username: string
    categories: ApiTypes.Model.Category[]
  }
}
