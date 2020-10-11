import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import '@progress/kendo-theme-material/dist/all.css';
import EmbeddedGrid from './embed'
import Jexcel from './jexcel'

export default function App() {
  console.log('Fail')
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={EmbeddedGrid} />
        <Route exact path='/jexcel' component={Jexcel} />
      </Switch>
    </Router>
  );
}