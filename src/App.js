import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import '@progress/kendo-theme-material/dist/all.css';
import EmbeddedGrid from './embed'

export default function App() {
  return (
    <EmbeddedGrid />
  );
}