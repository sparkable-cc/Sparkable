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
}

export declare namespace ApiTypes.Req {}

export declare namespace ApiTypes.Res {
  interface Links {
    links: ApiTypes.Model.Link[],
    total: number
  }
}
