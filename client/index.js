import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import socket from 'socket.io-client';
import history from './history';
import store from './store';
import App from './App';

// todos workshop
// window.io = io()
// window.io.on('action', (action) => // dispatch action )
// )
// lab
const clientSocket = socket(window.location.origin);
clientSocket.on('connect', () => {
  console.log('Socket connected to server');
}); // socket connections in scenes- Main.js in client. Open socket connection this.socket= new Socket.io..... create function.
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);
