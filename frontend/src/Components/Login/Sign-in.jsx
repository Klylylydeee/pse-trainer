import React, { useContext } from "react";
import { axiosAPI } from "../../services/axios";
import env from "react-dotenv";
import { AuthAPI } from "../../AuthAPI";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { userLogin } from "../../State/Authorization/Auth";
import { updateStock } from "../../State/Stocks/Stock";
import Cookies from "js-cookie";

const SignIn = () => {
    const dispatch = useDispatch();
    const Auth = useContext(AuthAPI);

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        Auth.setspinnerCurr(true)
        try {
            let loginData = await axiosAPI.post("auth/signin", {
                username: event.target.username.value,
                password: event.target.password.value
            });
            if (loginData) {
              let decodedData = await jwt.verify(
                loginData.data.token,
                env.BACKEND_SECRET
              );
              console.log(decodedData)
              dispatch(userLogin({ 
                id: decodedData.user._id,
                first_name: decodedData.user.first_name,
                last_name: decodedData.user.last_name,
                email: decodedData.user.email,
                username: decodedData.user.username,
                wallet: decodedData.user.wallet.amount
              }))
              dispatch(updateStock(decodedData.user.listing.stocks))
              Auth.setAuth(true)
              Cookies.set("user", loginData.data.token)
            }
        } catch (err) {
            if(err.response){
                console.log(err.response.data.message)
            }
            console.log(err.message)
        }
        Auth.setspinnerCurr(false)
    };

    return (
        <form onSubmit={handleOnSubmit} style={{ padding: '15px 0'}}>
            <div style={{display: 'flex', paddingBottom: '10px'}}>
                <label for="username" style={{ paddingRight: '5px', fontSize: '16px' }}>Username: </label>
                <input type="text" name="username" style={{flex: 1}}/>
            </div>
            <div style={{display: 'flex', paddingBottom: '10px'}}>
                <label for="password" style={{ paddingRight: '10px', fontSize: '16px' }}>Password: </label>
                <input type="password" name="password" style={{flex: 1}}/>
            </div>
            <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'green', border:'none',  padding: '10px', borderRadius: '5px'}}
            type="submit">Login</button>
        </form>
    );
}

export default SignIn;