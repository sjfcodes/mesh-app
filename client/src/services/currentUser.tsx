import React, { createContext, useMemo, useState } from 'react';
import { useContext } from 'react';
import { AmplifyUser } from '@aws-amplify/ui';

interface CurrentUserContext {
  useUser: [AmplifyUser, React.Dispatch<AmplifyUser>];
}

const UserContext = createContext({} as CurrentUserContext);

// @ts-ignore
export const UserProvider = ({ user, children }) => {
  const useUser = useState(user as AmplifyUser);
  const value = useMemo(() => ({ useUser }), [useUser]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
