import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Grid from './grid'
import GridTest from './gridtest'
import Jexcel from './jexcel'
import GridJson from './gridJson'
import GridWrapper from './gridwrapper'

export default function App() {
  return (
    <div>
      Components
      <Router>
        <Switch>
          <Route exact path='/grid' render={() => <Grid key='grid' />} />
          <Route exact path='/gridtest' render={() => <GridTest key='gridt' {...GridJson} />} />
          <Route exact path='/' render={() => <GridWrapper key='gridw' />} />
          <Route exact path='/jexcel' component={Jexcel} />
        </Switch>
      </Router>
    </div>
  );
}