import { configureStore } from "@reduxjs/toolkit";

import userInformation from './Authorization/Auth';
import stockInformation from './Stocks/Stock';

const reducer = configureStore({
  reducer: {
    user: userInformation,
    stock: stockInformation
  }
})

export default reducer;