import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from "../../utils/api";
import { ApiTypes } from "../../types";

export const submissionApi = createApi({
  reducerPath: "submissionApi",
  tagTypes: ["submissionApi"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    postLinkPreview: builder.query<ApiTypes.Res.SubmissionLinkPreview, string>({
      query: (value: string) => ({
        url: `/link-preview-data`,
        method: "POST",
        body: {
          "url": value
        }
      }),
    }),
  }),
});

export const {
  useLazyPostLinkPreviewQuery
} = submissionApi;


export const postLinkPreview = submissionApi.endpoints.postLinkPreview;
