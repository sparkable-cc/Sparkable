import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ApiTypes } from "../types";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["articles"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    getArticles: builder.query<ApiTypes.Res.Links, ApiTypes.Req.LinksQueryParams>({
      query: (args) => {
        const { sort, categories } = args;
        return {
          url: `/links`,
          params: { sort, categories },
        };
      }
    }),
    getArticleByID: builder.query<ApiTypes.Res.Article, string>({
      query: (id) => ({
        url: `/links/${id}`,
        method: "GET",
      }),
    }),
    getCategories: builder.query<ApiTypes.Res.Categories, void>({
      query: () => {
        return {
          url: `/categories`,
        };
      }
    }),
  }),
});

export const {
  useLazyGetArticlesQuery,
  useLazyGetArticleByIDQuery,
  useLazyGetCategoriesQuery,
} = api;


export const getArticles = api.endpoints.getArticles;
export const getCategories = api.endpoints.getCategories;
export const getArticleByID = api.endpoints.getArticleByID;
