import React, { useEffect } from 'react';

import useLambda from '../hooks/useLambda';
import Header from '../components/Header/Header';

function Landing() {
  const [state] = useLambda();
  useEffect(() => console.log(state), [state]);

  return (
    <main>
      <Header />
      <div>
        <h1>Plaid Pattern</h1>
      </div>
    </main>
  );
}

export default Landing;
