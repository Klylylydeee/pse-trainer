import { createSlice } from "@reduxjs/toolkit";

export const stockInformation = createSlice({
  name: "Stock Information",
  initialState: {
    stocks: []
  },
  reducers: {
    updateStock: (state, action) => {
      state.stocks = action.payload
    },
    removeStock: (state, action) => {
      state.stocks = []
    },
  },
});

export const { updateStock, removeStock } = stockInformation.actions;

export default stockInformation.reducer;
