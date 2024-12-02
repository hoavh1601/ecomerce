// src/features/product/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  selectedProduct: null,
  searchResults: [],
  pagination: {
    page: 1,
    limit: 12,
    total: 0
  },
  filters: {
    category: '',
    search: '',
    sort: ''
  }
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  }
});

export const {
  setProducts,
  setSelectedProduct,
  setSearchResults,
  setPagination,
  setFilters,
  resetFilters,
  clearSelectedProduct
} = productSlice.actions;

export default productSlice.reducer;