import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sellerApi = createApi({
  reducerPath: "sellerApi",
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
  tagTypes: ["Products", "Orders"],
  endpoints: (builder) => ({
    // Products
    getSellerProducts: builder.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          sellerId: params.sellerId,
          name: params.name || "",
          minPrice: params.minPrice || 0,
          maxPrice: params.maxPrice || 0,
          stockFilter: params.stockFilter || "",
          categoryId: params.categoryId || "",
        },
      }),
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    // Orders
    getSellerOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
    getCategories: builder.query({
      query: () => "/categories",
    }),
  }),
});

export const {
  useGetSellerProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetCategoriesQuery,
} = sellerApi;
