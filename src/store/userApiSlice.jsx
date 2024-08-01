import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com/",
  }),
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => "users?limit=100",
    }),
  }),
});

export const { useFetchUsersQuery } = userApi;
