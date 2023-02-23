import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL_API,
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  
  const tokenExpires = sessionStorage.getItem("token-expires");

  console.log('isAfter', dayjs().isAfter(dayjs(tokenExpires)))
  // if (result.error && result.error.status === 401) {
  //   // sign user out
  //   sessionStorage.clear();
  //   //tell user about it
  //   toast.error("You have been signed out");
  // }
  return result;
};
