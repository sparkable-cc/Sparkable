import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiTypes } from "../../types";

export const articlesApi = createApi({
  reducerPath: "articlesApi",
  tagTypes: ["articlesApi"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    getArticles: builder.query<ApiTypes.Res.Links, ApiTypes.Req.LinksQueryParams>({
      query: (args) => {
        const { sort, categories, page, stage } = args;
        return {
          url: `/links`,
          params: { sort, categories, page, stage },
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
} = articlesApi;


export const getArticles = articlesApi.endpoints.getArticles;
export const getCategories = articlesApi.endpoints.getCategories;
export const getArticleByID = articlesApi.endpoints.getArticleByID;
