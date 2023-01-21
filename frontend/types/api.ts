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

  type CategorySlug = "Art+&+Culture" | "Business+&+Economy" | "Environment" | "Technology"

  interface Filter {
    name: string,
    slug: CategorySlug
 }
}

export declare namespace ApiTypes.Req {


  interface LinksQueryParams {
    sort?: "-date",
    categories?: ApiTypes.Model.CategorySlug[]
  }
}

export declare namespace ApiTypes.Res {
  interface Links {
    links: ApiTypes.Model.Link[],
    total: number
  }
}
