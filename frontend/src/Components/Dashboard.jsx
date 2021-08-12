import React, { useContext, useEffect } from "react";
import { AuthAPI } from "../AuthAPI";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { userLogout, transaction } from "../State/Authorization/Auth";
import { updateStock } from "../State/Stocks/Stock";
import { removeStock } from "../State/Stocks/Stock";
import { axiosAPI } from "../services/axios";
import StocksModal from "./StocksData/StocksModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Auth = useContext(AuthAPI);
  
  const handleOnClick = () => {
    dispatch(userLogout());
    dispatch(removeStock());
    Auth.setAuth(false);
    Cookies.remove("user");
  };

  const { id, wallet, username } = useSelector((state) => state.user);
  const { stocks } = useSelector((state) => state.stock);
  
  let stocksExist = stocks.length >= 1 ? true : false;
  
  useEffect(() => {
    // eslint-disable-next-line
    stocksExist = stocks.length >= 1 ? true : false;
  }, [stocks, wallet]);

  return (
    <>
      <div style={{ padding: '15px 0' }}>
        <h1>Dashboard</h1>
        <p style={{ paddingBottom: '15px' }}>
        Username: { username }
        </p>
        <p style={{ paddingBottom: '15px' }}>
        Buying Power: { wallet }
        </p>
      </div>
      <hr style={{ marginBottom: '15px' }}/>
      {
        !stocksExist ? (
          <p style={{ paddingBottom: '15px' }}>You don't own any stocks. Please purchase stocks once the market has opened.</p>
        ) : stocks.map((stockData, stockIndex)=> {
          return (
            <div style={{ display: 'grid', gridAutoFlow: 'row', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 0' }}  key={stockIndex}>
              <p >
                {stockData.stock_name}
              </p>
              <p >
                {stockData.stock_average_price}
              </p>  
              <p >
                {stockData.stock_amount}
              </p>
              <StocksModal {...stockData} type="Sell" />
            </div>
          )
        })
      }
      <hr />
      <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'green', border:'none',  padding: '10px', borderRadius: '5px', marginTop: '25px'}}
      onClick={handleOnClick}>Lougout</button>
    </>
  );
};

export default Dashboard;
