import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiTypes } from "../../types";
import { baseQueryWithAuth } from "../../utils/api";

export const votingApi = createApi({
  reducerPath: "voting",
  tagTypes: ["voting"],
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getVotingStatus: builder.query<ApiTypes.Res.VotingStatus, ApiTypes.Req.VotingStatus>({
      query: (body) => ({
        url: `/voting-status`,
        method: "POST",
        body
      }),
    }),
    getLinksInCurrentCycle: builder.query<ApiTypes.Res.Article[], string>({
      query: (userUuid) => ({
        url: `/viewed-links-in-current-cycle`,
        method: "GET",
        params: {
          userUuid: userUuid
        },
      }),
    }),
    createVotes: builder.query<ApiTypes.Res.Message, ApiTypes.Req.CreateVotes>({
      query: (data) => ({
        url: `/votes`,
        method: "POST",
        body: data
      }),
    }),
  }),
});

export const {
  useLazyGetVotingStatusQuery,
  useLazyGetLinksInCurrentCycleQuery,
  useLazyCreateVotesQuery,
} = votingApi;

export const getVotingStatus = votingApi.endpoints.getVotingStatus;