import React, { useState, useEffect } from 'react';
import { AuthAPI } from './AuthAPI';
import jwt from 'jsonwebtoken';
import env from "react-dotenv";
import { useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { userLogin } from "./State/Authorization/Auth";
import { updateStock } from "./State/Stocks/Stock";
import StocksData from './Components/StocksData';
import { SemipolarLoading } from 'react-loadingg';
import { SlidingPanelContainer } from './Components/SidePanel';
import Hero from './Components/Hero';
import Logo from './Assets/AR Book.svg'
import './App.scss';

const App = () => {

  const [ auth, setAuth ] = useState(false)
  const [ spinnerCurr, setspinnerCurr ] = useState(false)
  const [ panelStatus, setPanelStatus ] = useState(true)
  const dispatch = useDispatch();

  useEffect(()=>{
    const readCookie = async () => {
      try {
        const user = Cookies.get("user");
        if(user){
          let decodedData = await jwt.verify(
            user,
            env.BACKEND_SECRET
          );
          dispatch(userLogin({ 
            id: decodedData.user._id,
            first_name: decodedData.user.first_name,
            last_name: decodedData.user.last_name,
            email: decodedData.user.email,
            username: decodedData.user.username,
            wallet: decodedData.user.wallet.amount
          }))
          dispatch(updateStock(decodedData.user.listing.stocks))
          setAuth(true)
        } else {
          Cookies.remove("user")
          setAuth(false)
        }
      } catch (err) {
        console.log(err)
        Cookies.remove("user")
        setAuth(false)
      }
    }
    readCookie();
    // eslint-disable-next-line
  },[]) 

  return (
    <div style={{ fontFamily: `Poppins`}}>
      {
        spinnerCurr ?  (
          <div style={{ zIndex: 9999, position: 'fixed', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%'}}>
            <SemipolarLoading/>
          </div>
        ) : ''
      }
      <AuthAPI.Provider value={{ auth, setAuth, spinnerCurr, setspinnerCurr, panelStatus, setPanelStatus }}>
      {
        auth ? 
        <StocksData /> :
        <Hero />
      }
      </AuthAPI.Provider>
      <AuthAPI.Provider value={{ auth, setAuth, spinnerCurr, setspinnerCurr, panelStatus, setPanelStatus }}>
        <SlidingPanelContainer />
      </AuthAPI.Provider>
    </div>
  );
}

export default App;
