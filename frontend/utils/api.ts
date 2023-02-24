import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { quotesClear } from "./quotesClear";
import { storageKeys } from "./storageKeys";

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API,
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem(storageKeys.token);
    if (token) {
      headers.set("Authorization", `Bearer ${quotesClear(token)}`);
    }
    return headers;
  },
});