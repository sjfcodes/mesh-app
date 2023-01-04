import React, { useEffect } from 'react';
import { AmplifyUser, AuthEventData } from '@aws-amplify/ui';

import logo from './logo.svg';
import './App.css';
import useLambda from './hooks/useLambda';

type props = {
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
  user: AmplifyUser | undefined;
};

function App({ signOut, user }: props) {
  const [state] = useLambda();

  useEffect(() => console.log(state), [state]);

  return (
    <main>
      <header className="App-header">
        <h1>New New {user?.attributes?.email}</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
