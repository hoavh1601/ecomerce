import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../../features/auth/authSlice";
import { authApi } from "../../features/auth/authApi";
import { productApi } from "../../features/product/productApi";
import productReducer from "../../features/product/productSlice";
// import { orderApi } from '../../features/order/orderApi';
import sellerReducer from "../../features/seller/sellerSlice";
import { sellerApi } from "../../features/seller/sellerApi";
import { adminApi } from "../../features/admin/adminApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    // [orderApi.reducerPath]: orderApi.reducer,
    product: productReducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
    seller: sellerReducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      sellerApi.middleware,
      adminApi.middleware
      //   orderApi.middleware
    ),
});

setupListeners(store.dispatch);
