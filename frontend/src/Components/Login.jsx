import React, { useContext, useEffect, useState } from "react";
import { axiosAPI } from "../services/axios";
import { AuthAPI } from "../AuthAPI";
import Cookies from "js-cookie";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from "react-google-login";
import env from "react-dotenv";
import jwt from "jsonwebtoken";
import { useSelector, useDispatch } from "react-redux";
import { userLogin } from "../State/Authorization/Auth";
import { updateStock } from "../State/Stocks/Stock";
import SignIn from "./Login/Sign-in";
import SignUp from "./Login/Sign-up";

const Login = () => {
  const dispatch = useDispatch();
  const Auth = useContext(AuthAPI);
  const [ formType, setFormType ] = useState(false);
  const { first_name, last_name, email, username, wallet } = useSelector((state) => state.user);
  const { stocks } = useSelector((state) => state.stock);

  useEffect(()=>{
    console.log(first_name)
    console.log(last_name)
    console.log(email)
    console.log(username)
    console.log(wallet)
    console.log(stocks)
    console.log(Auth)
    // eslint-disable-next-line
  }, [stocks])

  const responseFacebook = async (response) => {
    Auth.setspinnerCurr(true)
    try {
      let loginData = {
        first_name: response.name.split(" ")[0],
        last_name: response.name.split(" ")[1],
        username: response.email
          .split("@")[0]
          .split(".")
          .join("")
          .split("_")
          .join(""),
        email: response.email,
        password: response.id,
        type: "Facebook",
      };
      let facebookLoginData = await axiosAPI.post("auth/social-media", loginData);
      if (facebookLoginData) {
        let decodedData = await jwt.verify(
          facebookLoginData.data.token,
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
        Auth.setAuth(true)
        Cookies.set("user", facebookLoginData.data.token)
      }
    } catch (err) {
      console.log(err)
      // console.log(err.response.data);
    }
    Auth.setspinnerCurr(false)
  };

  const responseSucessGoogle = async (response) => {
    Auth.setspinnerCurr(true)
    try {
      let loginData = {
        first_name: response.profileObj.givenName,
        last_name: response.profileObj.familyName,
        username: response.profileObj.email
          .split("@")[0]
          .split(".")
          .join("")
          .split("_")
          .join(""),
        email: response.profileObj.email,
        password: response.googleId,
        type: "Google",
      };
      let googleLoginData = await axiosAPI.post("auth/social-media", loginData);
      if (googleLoginData) {
        let decodedData = await jwt.verify(
          googleLoginData.data.token,
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
        Cookies.set("user", googleLoginData.data.token)
      }
    } catch (err) {
      console.log(err)
      // console.log(err.response.data.message)
      // console.log(err.message)
    }
    Auth.setspinnerCurr(false)
  };

  const responseErrorGoogle = (response) => {
    console.log(response);
  };
  
  return (
    <div style={{ color: '#FFFDD0', maxWidth: '500px'}}>
      { !formType ? (
        <>
        <h1 style={{ fontSize: '25px', letterSpacing: '3px' }}>
          <span style={{color: 'green'}}>PSE</span> Trainer
        </h1>
        <SignIn /> 
        <hr style={{ marginBottom: '10px'}}/>
        <div style={{ display: 'flex', justifyItems: 'center' }}>
          
        <FacebookLogin
          appId="2749218752035553"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          render={renderProps => (
            <button onClick={renderProps.onClick} style={{ height: '35px', width: '100%', backgroundColor: '#3b5998', border: '0px transparent', color: '#FFFDD0', fontFamily: 'Poppins' }}>Login with Facebook</button>
          )}                                                       
          />
        <p>
        </p>
        <GoogleLogin
          clientId={`${env.GOOGLE_CLIENT_ID}`}    
          render={renderProps => (
            <button onClick={renderProps.onClick} disabled={renderProps.disabled} style={{ height: '35px', width: '100%', backgroundColor: '#db3236', border: '0px transparent', color: '#FFFDD0', fontFamily: 'Poppins' }}>Login with Google</button>
          )}
          buttonText="Login with Google"
          onSuccess={responseSucessGoogle}
          onFailure={responseErrorGoogle}
          cookiePolicy={"single_host_origin"}
        />
        </div>
        <hr style={{ margin: '10px 0'}}/>
        <p onClick={()=>{
          setFormType(!formType)
        }} style={{ fontSize: '13px' }}>
          Don't have an account? <span style={{ display: 'block'}}>
          Create an <span style={{color: 'green'}}>account</span>
          </span>
        </p>
        </>
      ) : (
        <>
          <AuthAPI.Provider value={{ Auth, formType, setFormType }}>
            <SignUp />
          </AuthAPI.Provider>
          <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'green', border:'none',  padding: '10px', borderRadius: '5px'}}
            type="submit" onClick={()=>{
              setFormType(!formType)
            }}>Cancel</button>
        </>
      )
      }
    </div>
  );
};

export default Login;
