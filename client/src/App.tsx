import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Landing from './pages/Landing';
import { AppProvider } from './hooks/useUser';

import './App.scss';

import currentConfig from './auth/config';
import { LinkProvider } from './hooks/useLink';
import { InstitutionsProvider } from './services/PlaidInstitutions/Provider';
import { ItemsProvider } from './hooks/useItems';
import { AccountsProvider } from './hooks/useAccounts';
import { TransactionsProvider } from './hooks/useTransactions';
import UserPage from './pages/UserPage';
import { AssetsProvider } from './services/Assets/Provider';
import { ErrorsProvider } from './services/Errors/Provider';
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
          <AppProvider user={user} signOut={signOut}>
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
          </AppProvider>
        );
      }}
    </Authenticator>
  );
}

export default App;
