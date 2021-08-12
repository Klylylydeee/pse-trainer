import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthAPI } from '../AuthAPI';
import UnprotectedRoutes from './UnprotectedRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import NotFoundRoute from './NotFound'
import Dashboard from '../Components/Dashboard'
import Login from '../Components/Login'

const Routes = () => {
    const Auth = useContext(AuthAPI)
    return (
      <Switch>
        <UnprotectedRoutes path="/" exact auth={Auth.auth} component={Login} />
        <ProtectedRoutes path="/dashboard" auth={Auth.auth} component={Dashboard} />
        <Route path="*" component={NotFoundRoute} />
      </Switch>
    )
};

export default Routes;
