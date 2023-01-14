import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { toast } from 'react-toastify';
import '@aws-amplify/ui-react/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { LinkProvider } from './services/Plaid/Link/Provider';
import { InstitutionsProvider } from './services/Plaid/Institutions/Provider';
import { TransactionsProvider } from './services/Plaid/Transactions/Provider';
import { AssetsProvider } from './services/Assets/Provider';
import { ErrorsProvider } from './services/Errors/Provider';

import { ItemsProvider } from './services/Plaid/Items/Provider';
import Landing from './pages/Landing';
import UserPage from './pages/UserPage/UserPage';
import currentConfig from './auth/config';
import './App.scss';
import CustomAuthenticator from './components/CustomAuthenticator';

Amplify.configure(currentConfig);

function App() {
  toast.configure({
    autoClose: 8000,
    draggable: false,
    toastClassName: 'box toast__background',
    bodyClassName: 'toast__body',
    hideProgressBar: true,
  });
  return (
    <CustomAuthenticator>
      <InstitutionsProvider>
        <ItemsProvider>
          <LinkProvider>
            <TransactionsProvider>
              <ErrorsProvider>
                <AssetsProvider>
                  <div className="toast__body">
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/user/:userId" element={<UserPage />} />
                    </Routes>
                  </div>
                </AssetsProvider>
              </ErrorsProvider>
            </TransactionsProvider>
          </LinkProvider>
        </ItemsProvider>
      </InstitutionsProvider>
    </CustomAuthenticator>
  );
}

export default App;
