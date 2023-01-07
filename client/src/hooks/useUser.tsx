import React, { useContext, createContext, useMemo, useState } from 'react';
import { AuthEventData } from '@aws-amplify/ui';
import { AmplifyUser } from '@aws-amplify/ui';

type SignOut = ((data?: AuthEventData | undefined) => void) | undefined;
interface CurrentUserContext {
  useUser: [AmplifyUser, React.Dispatch<AmplifyUser>];
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
}

const UserContext = createContext({} as CurrentUserContext);

type props = {
  children: any;
  user: AmplifyUser | undefined;
  signOut: SignOut;
};

// @ts-ignore
export const AppProvider = ({ user, children, signOut }: props) => {
  const useUser = useState(user as AmplifyUser);
  const value = useMemo(() => ({ useUser, signOut }), [useUser, signOut]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAppContext = () => useContext(UserContext);
