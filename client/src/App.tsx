import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';

import Landing from './pages/Landing';
import { AppProvider } from './services/currentUser';

import './App.scss';

import currentConfig from './auth/config';
import { LinkProvider } from './hooks/useLink';
Amplify.configure(currentConfig);

function App() {
  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <AppProvider user={user} signOut={signOut}>
          <LinkProvider>
            <Switch>
              <Route exact path="/" component={Landing} />
            </Switch>
          </LinkProvider>
        </AppProvider>
      )}
    </Authenticator>
  );
}

export default withRouter(App);
