import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  Dispatch,
} from 'react';
import { AssetType } from '../types';

interface AssetsState {
  assets: AssetType[] | null;
}

const initialState = { assets: null };

type AssetsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: string;
    }
  | { type: 'FAILED_GET'; payload: number };

interface AssetsContextShape extends AssetsState {
  dispatch: Dispatch<AssetsAction>;
  assetsByUser: AssetsState;
}
const AssetsContext = createContext<AssetsContextShape>(
  initialState as AssetsContextShape
);

/**
 * @desc Maintains the Properties context state
 */
export function AssetsProvider(props: any) {
  const [assetsByUser, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => {
    return {
      assetsByUser,
    };
  }, [assetsByUser]);

  return <AssetsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the propertiesByUser as dictated by dispatched actions.
 */
function reducer(state: AssetsState, action: AssetsAction | any) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      return {
        assets: action.payload,
      };
    case 'FAILED_GET':
      return {
        ...state,
      };
    default:
      console.warn('unknown action: ', action.type, action.payload);
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Properties context state in components.
 */
export default function useAssets() {
  const context = useContext(AssetsContext);

  if (!context) {
    throw new Error(`useAssets must be used within a AssetsProvider`);
  }

  return context;
}
