import React, { useEffect, useState, useContext } from "react";
import { AuthAPI } from "../AuthAPI";
import { axiosStock } from '../services/axios';
import StocksModal from "./StocksData/StocksModal";
import background from '../Assets/background1.jpg'
import Cookies from 'js-cookie'

const StocksData = () => {
    const Auth = useContext(AuthAPI);
    const [ data, updateData ] = useState([]);

    const fetchPSEIndex = async () => {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0,0,0,0)
      const response = await axiosStock.get("stocks.json")
      .catch((err) => { console.log(err) });
      if(response.data.stock !== null){
        response.expiration = tomorrow;
        localStorage.setItem('stocks', JSON.stringify({ 
          stocks: response.data.stock,
          expiration: response.expiration
        }));
      }
    }

    useEffect(() => {
      const setData = async () => {
        if (!localStorage.getItem('stocks')) {
          fetchPSEIndex();
        }
        const getDataFromStorage = JSON.parse(localStorage.getItem('stocks'));
        const getDateToday = new Date().getDate();
        if (getDataFromStorage && getDateToday === new Date(getDataFromStorage.expiration).getDate()) {
          localStorage.removeItem('stocks')
          fetchPSEIndex();
        }
        getDataFromStorage ? updateData(getDataFromStorage.stocks) : console.log('No stocks available')
      };
      setData();
    }, []);

    return (
      <div style={{ display: 'flex', justifyContent:'center', minHeight: '300vh', maxHeight: '100%', background: `linear-gradient(90deg, rgba(38,55,74,1) 0%, rgba(38,55,74,0.9108018207282913) 3%, rgba(255,255,255,0) 100%), 
      url(${background})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'center', width: '100%', maxWidth: '2000px', padding: '0 50px', color: '#fffdd0'}}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding:'10px 0'}}>
              <h1 style={{ fontSize: '25px', letterSpacing: '3px' }}>
                <span style={{color: 'green'}}>PSE</span> Trainer
              </h1>
              <div>
                <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'green', border:'none',  padding: '10px', borderRadius: '5px', marginRight: '15px'}}
                onClick={()=>{Auth.setPanelStatus(true)
                }}>Dashboard</button>
                {/* <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'green', border:'none',  padding: '10px', borderRadius: '5px', marginRight: '15px'}}
                onClick={()=>{Auth.setPanelStatus(true)
                }}>History</button> */}
                <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'red', border:'none',  padding: '10px', borderRadius: '5px'}}
                onClick={()=>{
                  Auth.setAuth(false);
                  Cookies.remove("user");
                }}>Logout</button>
              </div>
            </div>
            {
                data.map((currStock, mapIndex)=>{
                    return (
                      <div style={{ display: 'grid', gridAutoFlow: 'row', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '10px 0' }} index={mapIndex}>
                        <p>{currStock.name}</p>
                        <p>{currStock.symbol}</p>
                        <p>{currStock.price.amount}</p>
                        <p style={{ color: currStock.percent_change < 0 ? `red` : `green` }}>{currStock.percent_change}</p>
                        <StocksModal {...currStock} type="Buy" />
                      </div>
                    )
                })
            }
          </div>
        </div>
    )
};

export default StocksData; 