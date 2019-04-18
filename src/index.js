import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import UserHome from './components/UserEnd/UserHome.js';
import RestHome from './components/RestaurantEnd/RestHome.js'
import UserInfo from './components/UserInfo.js'
import UserEndReservation from './components/UserEndReservation'
import SearchPage from './components/SearchPage.js'
ReactDom.render(
    <Router>
        <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={UserHome} />
            <Route exact path={`${process.env.PUBLIC_URL}/restaurant`} component={RestHome} />
            <Route exact path={`${process.env.PUBLIC_URL}/userInfo`} component={UserInfo} />
            <Route exact path={`${process.env.PUBLIC_URL}/search/`} component={SearchPage} />
            <Route exact path={`${process.env.PUBLIC_URL}/reservationPage/:id`} component={UserEndReservation} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
