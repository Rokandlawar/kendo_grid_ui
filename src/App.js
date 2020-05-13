import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Grid from './grid'
import Jexcel from './jexcel'
import GridJson from './gridJson'

export default function App() {
  return (
    <div>
      Components
      <Router>
        <Switch>
          <Route exact path='/grid' render={() => <Grid key='grid' />} />
          <Route exact path='/jexcel' component={Jexcel} />
        </Switch>
      </Router>
    </div>
  );
}