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
  }),
});

export const {
  useLazyGetVotingStatusQuery,
  useLazyGetLinksInCurrentCycleQuery,
} = votingApi;

export const getVotingStatus = votingApi.endpoints.getVotingStatus;