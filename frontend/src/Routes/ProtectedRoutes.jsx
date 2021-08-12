import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoutes = ({ auth, component: Component, ...rest }) => {
    return (
      <Route 
      {...rest}
      render={()=>(
        auth ? 
        <Component />
        : <Redirect to="/" />
      )}
      />
    )
};
  
export default ProtectedRoutes;