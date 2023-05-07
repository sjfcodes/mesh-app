import { createContext, useMemo, useState } from 'react';

import { IAppContext } from './types';

export const AppContext = createContext({} as IAppContext);

export const AppProvider = ({ children }: any) => {
  const useSectionHeader = useState('testing123');
  const value = useMemo(() => ({ useSectionHeader }), [useSectionHeader]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
