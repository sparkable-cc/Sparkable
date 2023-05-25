/* eslint-disable */
export declare namespace ApiTypes.Model {
  interface Link {
    id: number;
    uuid: string;
    title: string;
    url: string;
    image: string;
    date: Date;
    username: string;
    description: string;
    userUuid: string;
    statement?: string;
    categories: Category[];
  }

  interface Category {
    id: number
    name: string,
    slug: string
  }

  interface SubmissionLinkImage {
    url: string
    width: number
    height: number
    type: string
  }

  interface Vote {
    linkUuid: string
  }
}

export declare namespace ApiTypes.Req {
  interface LinksQueryParams {
    sort?: "-date",
    categories?: string[]
    page?: number
    stage?: number
  }

  interface SignUp {
    email: string
    username: string
    password: string
  }

  interface SignIn {
    email?: string
    username?: string
    password: string
  }

  interface CreateLink {
    title: string;
    url: string;
    categories: ApiTypes.Model.Category[];
    userUuid: string;
    description: string;
    image: string;
    statement?: string;
    suggestionCategory?: string;
  }

  interface CreateViewedLinkByUserData {
    userUuid: string
    linkUuid: string
  }

  interface PasswordRecovery {
    email: string
  }

  interface PasswordReset {
    password: string
  }

  interface VotingStatus {
    date: string
    userUuid?: string
  }

  interface CreateVotes {
    userUuid: string
    votes: ApiTypes.Model.Vote[]
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
    id: number;
    uuid: string;
    title: string;
    url: string;
    image: string;
    description?: string;
    date: string;
    username: string;
    userUuid: string;
    statement?: string;
    categories: ApiTypes.Model.Category[];
  }

  interface Token {
    access_token: string,
    expires_in: string,
    token_type: string
    uuid: string
    username: string
    stage: number
  }

  interface SubmissionLinkPreview {
    ogTitle: string
    ogType: string
    ogUrl: string
    ogDescription: string
    ogImage: ApiTypes.Model.SubmissionLinkImage[]
  }

  interface Message {
    message: string
  }

  interface VotingStatus {
    openVoting: boolean
    round: number
    nextOpenVotingDate: string
    daysUntilNextVoting: number
    timeUntilNextVoting: string
    userHasVoted: boolean
  }
}
