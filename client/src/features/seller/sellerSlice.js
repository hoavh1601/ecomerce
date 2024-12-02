import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "products", // or 'orders'
  selectedProduct: null,
  filters: {
    status: "all",
    search: "",
  },
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const { setActiveTab, setSelectedProduct, setFilters } =
  sellerSlice.actions;
export default sellerSlice.reducer;
