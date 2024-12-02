// src/features/admin/adminApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/statistics/dashboard",
    }),
    getRevenueStats: builder.query({
      query: (period) => `/statistics/revenue?period=${period}`,
    }),
    getTopProducts: builder.query({
      query: (limit = 10) => `/statistics/top-products?limit=${limit}`,
    }),
    getUsers: builder.query({
      query: (params) => ({
        url: "/users",
        params,
      }),
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueStatsQuery,
  useGetTopProductsQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} = adminApi;
