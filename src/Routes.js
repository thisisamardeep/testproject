import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// pages
import Home from './pages/Home';
import Overview from './pages/Overview';

const Routers = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/overview/:name' component={Overview} />
      <Route component={Home} />
    </Switch>
  </BrowserRouter>
);

export default Routers;
