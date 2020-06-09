import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App';
import './src/index.css';
import '@progress/kendo-theme-material/dist/all.css';

let elem = document.createElement('div')
elem.setAttribute('id', 'root')
document.body.appendChild(elem)
ReactDOM.render(

  <App />,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

