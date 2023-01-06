import React, { useEffect } from 'react';
import { AuthEventData } from '@aws-amplify/ui';

import logo from './logo.svg';
import './App.css';
import useLambda from './hooks/useLambda';
import { useUser } from './services/currentUser';
import  Banner  from './components/Banner';

type props = {
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
};

function App({ signOut }: props) {
  const [state] = useLambda();
  const {
    useUser: [user],
  } = useUser();

  useEffect(() => console.log(state), [state]);

  return (
    <main>
      <header className="App-header">
      <Banner />

        <h1>New New {user?.attributes?.email}</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
