import React, { useState, useContext } from "react";
import Modal from 'react-modal';
import { AuthAPI } from "../../AuthAPI";
import { updateStock } from "../../State/Stocks/Stock";
import { transaction } from "../../State/Authorization/Auth";
import Cookies from 'js-cookie'
import { axiosAPI } from "../../services/axios";
import { useDispatch, useSelector } from "react-redux";
import Random from '../../Assets/random.png'

const customStyles = {
  overlay: {
    zIndex: 99999,
    background: "rgba(0, 0, 0, 0.5)"
  },
    content: {
      minWidth: '50vw',
      backgroundColor: '#fffdd0',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

const StocksModal = (props) => {
  const dispatch = useDispatch();
  const Auth = useContext(AuthAPI);
    let { name, symbol, price, type } = props;
    let { stock_average_price, stock_name, stock_amount } = props;
    const [modalIsOpen, setIsOpen] = useState(false);
    const { id, wallet } = useSelector((state) => state.user);
  
    const openModal = () => {
    setIsOpen(true);
    }
  
    const afterOpenModal = () => {
    }
  
    const closeModal = () => {
      setIsOpen(false);
    }
    
    const handleOnSubmit = async (name, price, amount, type, inventory) => {
      closeModal()
      Auth.setspinnerCurr(true)
      try{
        // eslint-disable-next-line
      if(inventory < amount || amount*price > wallet && type === 'buy' || amount <= 0){
        throw alert('Incorrect Amount')
      }
      let stockResponse = await axiosAPI.post(`transaction/${id}?secret_token=${Cookies.get("user")}`, {
        type: type,
        stock_bought: name,
        stock_average_price: price,
        stock_amount: Number(amount),
        user_cash: wallet
      });
      console.log(stockResponse)
      dispatch(transaction(stockResponse.data.wallet.amount));
      dispatch(updateStock(stockResponse.data.listing.stocks));
      Cookies.remove("user")
      Cookies.set("user", stockResponse.data.token)
      } catch (err) {
        console.log(err) 
        // console.log(err.response.data.message) 
      }
      Auth.setspinnerCurr(false)
    }

    return (
        <>
        <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: type === 'Buy' ? 'green' : 'red', color: '#fffdd0', border:'none',  padding: '10px', borderRadius: '5px'}}
        onClick={openModal}>{type}</button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          ariaHideApp={false}
          style={customStyles}
          contentLabel="Example Modal"
        >
        {
          type === 'Buy' ? (
            <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Poppins'}}>
              <div style={{ display: 'grid', gridAutoFlow: 'row', gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'center', padding: '15px 0' }}>
                <img src={Random} alt="" style={{ maxHeight: '50px', maxWidth: '50px' }}/>
                <p>
                {name}
                </p>
                <p>
                {symbol}
                </p>
                <p>
                {price.amount}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
              <form onSubmit={(e)=>{
                e.preventDefault();
                handleOnSubmit(symbol, price.amount, e.target.nan.value, 'buy')
              }}>
                <input type="number" name="nan" style={{ border: 'none', minHeight: '50px', marginRight: '15px' }} placeholder="   Amount to purchase"/>
                <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#db3236', color: '#fffdd0', border:'none',  padding: '10px', borderRadius: '5px', marginRight: '15px'}}
                  type="submit" onClick={closeModal}>Cancel</button>
                  <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: 'green', color: '#fffdd0', border:'none',  padding: '10px', borderRadius: '5px'}}
                    type="submit" >Confirm</button>
              </form>
              </div>
            </div>
          ) : type === 'Sell' ? (
            <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Poppins'}}>
              <div style={{ display: 'grid', gridAutoFlow: 'row', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', padding: '15px 0' }}>
                <img src={Random} alt="" style={{ maxHeight: '50px', maxWidth: '50px' }}/>
               <p>
               {stock_average_price} 
              </p>
              <p>
              {stock_name}
               </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1' }}>
            <form onSubmit={(e)=>{
              e.preventDefault();
              handleOnSubmit(stock_name, stock_average_price, e.target.number.value, 'sell', stock_amount)
            }}>
              <input type="number" name="number" style={{ border: 'none', minHeight: '50px', marginRight: '15px'}} placeholder="   Amount to purchase"/>
              <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#db3236', color: '#fffdd0', border:'none',  padding: '10px', borderRadius: '5px', marginRight: '15px'}}
                type="submit" onClick={closeModal}>Cancel</button>
                <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: 'green', color: '#fffdd0', border:'none',  padding: '10px', borderRadius: '5px'}}
                  type="submit" >Confirm</button>
            </form>
              </div>
            </div>
          ) : ''
        }
        </Modal>
        </>
    )
};

export default StocksModal;