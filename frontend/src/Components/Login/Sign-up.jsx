import React, { useContext } from "react";
import { axiosAPI } from "../../services/axios";
import { AuthAPI } from "../../AuthAPI";

const SignUp = () => {
    const Auth = useContext(AuthAPI);
    const handleOnSubmit = async (event) => {
        event.preventDefault();
        Auth.Auth.setspinnerCurr(true)
        try {
            let signUpData = await axiosAPI.post("auth/signup", {
                first_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
                username: event.target.username.value,
                email: event.target.email.value,
                password: event.target.password.value
            });
            if(signUpData.data){
                Auth.setFormType(!Auth.formType)
                alert(signUpData.data.message)
            }
        } catch (err) {
            console.log(err.response.data.message)
            console.log(err.message)
        }
        Auth.Auth.setspinnerCurr(false)
    };
    
    return (
        <form onSubmit={handleOnSubmit} style={{ padding: '15px 0'}}>
            <div style={{display: 'flex', paddingBottom: '10px'}}>
                <label for="first_name" style={{ paddingRight: '5px', fontSize: '16px' }}>first_name: </label>
                <input type="text" name="first_name" style={{flex: 1}}/>
            </div>
            <div style={{display: 'flex', paddingBottom: '10px'}}>
                <label for="last_name" style={{ paddingRight: '5px', fontSize: '16px' }}>last_name: </label>
                <input type="text" name="last_name" style={{flex: 1}}/>
            </div>
            <div style={{display: 'flex', paddingBottom: '10px'}}>
                <label for="username" style={{ paddingRight: '10px', fontSize: '16px' }}>username: </label>
                <input type="text" name="username" style={{flex: 1}}/>
            </div>
            <div style={{display: 'flex', paddingBottom: '10px'}}>
                <label for="email" style={{ paddingRight: '45px', fontSize: '16px' }}>email: </label>
                <input type="email" name="email" style={{flex: 1}}/>
            </div>
            <div style={{display: 'flex', paddingBottom: '10px'}}>
                <label for="password" style={{ paddingRight: '13px', fontSize: '16px' }}>Password: </label>
                <input type="password" name="password" style={{flex: 1}}/>
            </div>
            <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'green', border:'none',  padding: '10px', borderRadius: '5px'}}
            type="submit">Create Account</button>
        </form>
    );
}

export default SignUp;