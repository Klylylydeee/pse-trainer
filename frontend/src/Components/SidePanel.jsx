import React, { useContext } from "react";
import {AuthAPI} from '../AuthAPI';
import SlidingPanel from "react-sliding-side-panel";
import Routes from '../Routes/Routes';
import './SlidePanel/panel.scss';
import { useMediaQuery } from 'react-responsive'

export const SlidingPanelContainer = () => {
    const Auth = useContext(AuthAPI);
    const maxTablet = useMediaQuery({
      query: '(max-width: 768px)'
    })
    const minPC = useMediaQuery({
      query: '(min-width: 2000px)'
    })

    return (
      <SlidingPanel type={'right'} isOpen={Auth.panelStatus} size={maxTablet ? 90 : 30} backdropClicked={() => Auth.setPanelStatus(!Auth.panelStatus)} >
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: minPC ? 'center' : '', padding: '0 30px', color: '#fffdd0'}}>
          <Routes />
        </div>
      </SlidingPanel>
    )
}