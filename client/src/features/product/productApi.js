// src/features/product/productApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  }),
  endpoints: (builder) => ({
    getFeaturedProducts: builder.query({
      query: () => '/products?featured=true',
    }),
    getLatestProducts: builder.query({
      query: (limit = 10) => `/products?limit=${limit}&sort=-createdAt`,
    }),
    getTrendingProducts: builder.query({
      query: (limit = 10) => `/products?limit=${limit}&sort=-views`,
    }),
    getProductsByCategory: builder.query({
      query: ({ categoryId, limit = 10 }) => 
        `/products?categoryId=${categoryId}&limit=${limit}`,
    }),

    searchProducts: builder.query({
      query: (searchTerm) => `/products?search=${searchTerm}`,
    }),
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params: {
          page: params?.page || 1,
          limit: params?.limit || 12,
          search: params?.search,
          category: params?.category,
          sort: params?.sort,
        },
      }),
    }),

    getProduct: builder.query({
      query: (id) => `/products/${id}`,
    }),
  }),
});

export const {
  useGetFeaturedProductsQuery,
  useGetLatestProductsQuery,
  useGetTrendingProductsQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useGetProductsQuery,
  useGetProductQuery,
} = productApi;