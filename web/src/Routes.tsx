import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Content from './pages/Content';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function Routes() {
    return (<BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/signin" component={Login} />
            <Route path="/content" component={Content} />
        </Switch>
    </BrowserRouter>)
}

export default Routes;