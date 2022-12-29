import React from "react";

import logo from "./logo.svg";
import "./App.css";
import { AmplifyUser, AuthEventData } from "@aws-amplify/ui";

type props = {
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
  user: AmplifyUser | undefined;
};

function App({ signOut, user }: props) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <main>
          <h1>Hello {user?.attributes?.email}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      </header>
    </div>
  );
}

export default App;
