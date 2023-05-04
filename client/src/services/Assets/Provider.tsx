import React, { createContext, useMemo, useReducer } from 'react';

import assetsReducer from './reducer';
import { AssetsState } from './types';

const initialState: AssetsState = { assets: [] };
export const AssetsContext = createContext<AssetsState>(initialState);

/**
 * @desc Maintains the Properties context state
 */
export function AssetsProvider(props: any) {
  const [state] = useReducer(assetsReducer, initialState);

  const value = useMemo(() => {
    return { ...state };
  }, [state]);

  return <AssetsContext.Provider value={value} {...props} />;
}
