import { createContext, useMemo, useState } from 'react';
import { AmplifyUser } from '@aws-amplify/ui';

import { CurrentUserContext } from './types';

export const UserContext = createContext({} as CurrentUserContext);

// @ts-ignore
export const UserProvider = ({ user, children, signOut }: any) => {
  const useUser = useState(user as AmplifyUser);
  const value = useMemo(() => ({ useUser, signOut }), [useUser, signOut]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
