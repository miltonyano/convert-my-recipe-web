import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppProvider from './hooks';
import Routes from './routes';

import GlobalStyle from './styles/global';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </BrowserRouter>
);
export default App;
