import React, { useEffect } from 'react';

import useLambda from '../hooks/useLambda';
import { useAppContext } from '../services/currentUser';
import Banner from '../components/Banner';

import logo from '../logo.svg';

function Landing() {
  const [state] = useLambda();
  const { signOut } = useAppContext();

  useEffect(() => console.log(state), [state]);

  return (
    <main>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Banner />

      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default Landing;
