import { CognitoAttributes } from '@aws-amplify/ui';
import { createContext, useMemo } from 'react';

import { CurrentUserContext } from './types';

export const UserContext = createContext({} as CurrentUserContext);

export const UserProvider = ({ user, children, signOut }: any) => {
  const value = useMemo(
    () => ({ user: user.attributes as CognitoAttributes, signOut }),
    [user, signOut]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
