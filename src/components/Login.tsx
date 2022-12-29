import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import config from "../auth/config";

Amplify.configure(config);

function Login() {
  return (
    <Authenticator loginMechanisms={["email"]}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.attributes?.email}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default Login;
