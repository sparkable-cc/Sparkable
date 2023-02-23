import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { quotesClear } from "./quotesClear";

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API,
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${quotesClear(token)}`);
    }
    return headers;
  },
});