import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';

import Landing from './pages/Landing';
import { AppProvider } from './hooks/useUser';

import './App.scss';

import currentConfig from './auth/config';
import { LinkProvider } from './hooks/useLink';
import { InstitutionsProvider } from './hooks/useInstitutions';
import { ItemsProvider } from './hooks/useItems';
import { AccountsProvider } from './hooks/useAccounts';
import { TransactionsProvider } from './hooks/useTransactions';
import { ErrorsProvider } from './hooks/useErrors';
import UserPage from './pages/UserPage';
Amplify.configure(currentConfig);

function App() {
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
                        <Routes>
                          <Route path="/" element={<Landing />} />
                          <Route path="/user/:userId" element={<UserPage />} />
                        </Routes>
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
