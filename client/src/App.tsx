import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { UserProvider } from './services/User/Provider';
import { LinkProvider } from './services/Plaid/Link/Provider';
import { InstitutionsProvider } from './services/Plaid/Institutions/Provider';
import { TransactionsProvider } from './services/Plaid/Transactions/Provider';
import { AssetsProvider } from './services/Assets/Provider';
import { ErrorsProvider } from './services/Errors/Provider';

import { ItemsProvider } from './hooks/usePlaidItems';
import { AccountsProvider } from './hooks/usePlaidAccounts';
import Landing from './pages/Landing';
import UserPage from './pages/UserPage';
import currentConfig from './auth/config';
import './App.scss';

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
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => {
        return (
          <UserProvider user={user} signOut={signOut}>
            <InstitutionsProvider>
              <ItemsProvider>
                <LinkProvider>
                  <AccountsProvider>
                    <TransactionsProvider>
                      <ErrorsProvider>
                        <AssetsProvider>
                          <div className="toast__body">
                            <Routes>
                              <Route path="/" element={<Landing />} />
                              <Route
                                path="/user/:userId"
                                element={<UserPage />}
                              />
                            </Routes>
                          </div>
                        </AssetsProvider>
                      </ErrorsProvider>
                    </TransactionsProvider>
                  </AccountsProvider>
                </LinkProvider>
              </ItemsProvider>
            </InstitutionsProvider>
          </UserProvider>
        );
      }}
    </Authenticator>
  );
}

export default App;
