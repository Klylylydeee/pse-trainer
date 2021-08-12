import React, { useEffect, useContext } from "react";
import background from '../Assets/background1.jpg'
import {AuthAPI} from '../AuthAPI';
import tablet from '../Assets/tablet.svg'
import { useMediaQuery } from 'react-responsive'

const Hero = () => {
    const Auth = useContext(AuthAPI);
    const maxDesktop = useMediaQuery({
      query: '(max-width: 2560px)'
    })

    const topicData = [
        'Realtime Stock Price',
        'Complete PSE Index',
        'Buy and Sell Stocks',
        'Check Transaction History',
        'Authenticate through Facebook and Google',
    ]
    
    useEffect(()=>{
        console.log(maxDesktop)
    }, [maxDesktop]);

    return (
        <div style={{ display: 'flex', justifyContent:'center', minHeight: '100vh', minWidth: '100vw', background: `linear-gradient(90deg, rgba(38,55,74,1) 0%, rgba(38,55,74,0.9108018207282913) 3%, rgba(255,255,255,0) 100%), 
        url(${background})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center 50%', backgroundSize: 'cover'}}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'center', width: '100%', maxWidth: '2000px', padding: '0 50px', color: '#fffdd0'}}>
                <h1 style={{ fontSize: '50px' }}>The <span style={{ color: 'green' }}>Stock Market</span> Made Easier <span style={{ display: 'block', fontSize: '25px' }}>everything you need to learn to go from start to profits</span></h1>   
                <ul style={{ paddingTop: '15px' }}>
                    {
                        topicData.map((currData, indexData) => {
                            return (
                                <li key={indexData} style={{ listStyleType: 'none', padding: '3px 0' }}>
                                    <span style={{ color: 'green', paddingRight: '15px', paddingLeft: '5px' }}>•</span>  {currData}
                                </li>
                            )
                        })
                    }
                </ul>
                <div style={{ display: 'flex', paddingTop: '15px' }}>
                    <button  style={{ fontFamily: 'Poppins', cursor: 'pointer',  backgroundColor: 'green', color: '#fffdd0', border:'none', padding: '10px', marginRight: '15px', borderRadius: '5px'}}
                    onClick={()=>{
                        Auth.setPanelStatus(true)
                    }}>Browse PSE</button>
                    <button style={{  fontFamily: 'Poppins', cursor: 'pointer', backgroundColor: '#fffdd0', color: 'green', border:'none',  padding: '10px', borderRadius: '5px'}}
                    onClick={()=>{
                        Auth.setPanelStatus(true)
                    }}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default Hero;