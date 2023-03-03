import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiTypes } from "../../types";

export const trackingApi = createApi({
  reducerPath: "trackingApi",
  tagTypes: ["trackingApi"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    postViewedLinkByUserData: builder.query<ApiTypes.Res.CreateViewedLinkByUserData, ApiTypes.Req.CreateViewedLinkByUserData>({
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
