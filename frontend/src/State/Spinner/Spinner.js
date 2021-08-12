import { createSlice } from "@reduxjs/toolkit";

export const spinnerInformation = createSlice({
  name: "Stock Information",
  initialState: {
    spinner: false
  },
  reducers: {
    updateSpinner: (state, action) => {
      state.spinner = action.payload
    }
  },
});

export const { updateSpinner } = spinnerInformation.actions;

export default spinnerInformation.reducer;
