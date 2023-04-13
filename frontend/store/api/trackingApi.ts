import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiTypes } from "../../types";
import { baseQueryWithAuth } from "../../utils/api";

export const trackingApi = createApi({
  reducerPath: "trackingApi",
  tagTypes: ["trackingApi"],
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    postViewedLinkByUserData: builder.query<ApiTypes.Res.Message, ApiTypes.Req.CreateViewedLinkByUserData>({
      query: (data) => {
        return {
          url: `/viewed-link-user`,
          method: "POST",
          body: data
        };
      }
    })
  }),
});

export const {
  useLazyPostViewedLinkByUserDataQuery
} = trackingApi;

export const postViewedLinkByUserData = trackingApi.endpoints.postViewedLinkByUserData;
