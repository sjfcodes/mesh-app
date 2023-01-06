import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router as BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import '@aws-amplify/ui-react/styles.css';

import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter history={createBrowserHistory()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
