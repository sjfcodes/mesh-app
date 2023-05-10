import { createContext, useMemo, useState } from 'react';

import { IAppContext } from './types';

export const AppContext = createContext({} as IAppContext);

export const AppProvider = ({ children }: any) => {
  const useAppContext = useState({});
  const value = useMemo(() => ({ useAppContext }), [useAppContext]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
