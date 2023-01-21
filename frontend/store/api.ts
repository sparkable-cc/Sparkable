import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ApiTypes } from "../types";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["articles"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    getLinks:
      builder.query<ApiTypes.Res.Links, ApiTypes.Req.LinksQueryParams>({
        query: (args) => {
          const { sort, categories } = args;
          return {
            url: `/links`,
            params: { sort, categories },
          };
        }
      }),
  }),
});

export const {
  useLazyGetLinksQuery,
} = api;


export const getLinks = api.endpoints.getLinks
