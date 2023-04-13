import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from "../../utils/api";
import { ApiTypes } from "../../types";

export const submissionApi = createApi({
  reducerPath: "submissionApi",
  tagTypes: ["submissionApi"],
  baseQuery: baseQueryWithAuth,
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
    postLinks: builder.query<ApiTypes.Res.Message, ApiTypes.Req.CreateLink>({
      query: (data) => ({
        url: `/links`,
        method: "POST",
        body: data
      }),
    }),
  }),
});

export const {
  useLazyPostLinkPreviewQuery,
  useLazyPostLinksQuery
} = submissionApi;


export const postLinkPreview = submissionApi.endpoints.postLinkPreview;
