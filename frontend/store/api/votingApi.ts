import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiTypes } from "../../types";

export const votingApi = createApi({
  reducerPath: "voting",
  tagTypes: ["voting"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    getVotingStatus: builder.query<ApiTypes.Res.VotingStatus, ApiTypes.Req.VotingStatus>({
      query: (body) => ({
        url: `/voting-status`,
        method: "POST",
        body
      }),
    }),
  }),
});

export const {
  useLazyGetVotingStatusQuery,
} = votingApi;

export const getVotingStatus = votingApi.endpoints.getVotingStatus;