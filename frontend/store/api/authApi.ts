import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiTypes } from "../../types";

export const authApi = createApi({
  reducerPath: "auth",
  tagTypes: ["auth"],
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API }),
  endpoints: (builder) => ({
    signUp: builder.query<{ message: string }, ApiTypes.Req.SignUp>({
      query: (body) => ({
        url: `/user`,
        method: "POST",
        body
      }),
    }),
    signIn: builder.query<ApiTypes.Res.Token, ApiTypes.Req.SignIn>({
      query: (body) => ({
        url: `/signin`,
        method: "POST",
        body
      }),
    }),
  }),
});

export const {
  useLazySignUpQuery,
  useLazySignInQuery,  
} = authApi;
