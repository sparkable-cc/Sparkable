import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ApiTypes } from "../../types";

export const articles = createApi({
  reducerPath: "articles",
  tagTypes: ["articles"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    getLinks:
      builder.query<ApiTypes.Res.Links, void>({
        query: () =>
          `/links`,
      }),
  }),
});

export const {
  useLazyGetLinksQuery,
  reducer,
} = articles;
