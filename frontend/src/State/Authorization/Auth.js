import { createSlice } from "@reduxjs/toolkit";

export const userInformation = createSlice({
  name: "User Information",
  initialState: {
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    username: null,
    wallet: null,
  },
  reducers: {
    userLogin: (state, action) => {
      state.id = action.payload.id;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.wallet = action.payload.wallet;
    },
    userLogout: (state, action) => {
      state.id = null;
      state.first_name = null;
      state.last_name = null;
      state.email = null;
      state.username = null;
      state.wallet = null;
    },
    transaction: (state, action) => {
      console.log(action.payload)
      state.wallet = action.payload;
    },
  },
});

export const { userLogin, userLogout, transaction } = userInformation.actions;

export default userInformation.reducer;
