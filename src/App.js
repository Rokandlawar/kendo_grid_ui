import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import '@progress/kendo-theme-material/dist/all.css';
import EmbeddedGrid from './embed'
import Jexcel from './jexcel'
//Grids
import CompanyGrid from './grids/company'
import ApplicationGrid from './grids/application'
import PermitGrid from './grids/permit';
import InvoiceGrid from './grids/invoice';
import EventGrid from './grids/events';
//Reports
import DailyReport from './reports/daily';
import YearlyReport from './reports/yearly';
import SKUReport from './reports/sku';
import OtherReport from './reports/other'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={EmbeddedGrid} />
        <Route exact path='/jexcel' component={Jexcel} />
        <Route exact path='/application' component={ApplicationGrid} />
        <Route exact path='/permit' component={PermitGrid} />
        <Route exact path='/company' component={CompanyGrid} />
        <Route exact path='/invoice' component={InvoiceGrid} />
        <Route exact path='/events' component={EventGrid} />
        <Route exact path='/daily' component={DailyReport} />
        <Route exact path='/yearly' component={YearlyReport} />
        <Route exact path='/sku' component={SKUReport} />
        <Route exact path='/other' component={OtherReport} />
      </Switch>
    </Router>

  );
}