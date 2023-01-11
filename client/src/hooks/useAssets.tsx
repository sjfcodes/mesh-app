import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  // useCallback,
  Dispatch,
} from 'react';
// import { toast } from 'react-toastify';
import { AssetType } from '../types';
import useApi from './useApi';

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
  // addAsset: (userId: string, description: string, value: number) => void;
  assetsByUser: AssetsState;
  // getAssetsByUser: (userId: string) => void;
  // deleteAssetByAssetId: (assetId: string, userId: string) => void;
}
const AssetsContext = createContext<AssetsContextShape>(
  initialState as AssetsContextShape
);

/**
 * @desc Maintains the Properties context state
 */
export function AssetsProvider(props: any) {
  // const {
    // addAsset: apiAddAsset,
    // getAssetsByUser: apiGetAssetsByUser,
    // deleteAssetByAssetId: apiDeleteAssetByAssetId,
  // } = useApi();
  const [assetsByUser, dispatch] = useReducer(reducer, initialState);

  // const getAssetsByUser = useCallback(async (userId: number) => {
  //   try {
  //     const { data: payload } = await apiGetAssetsByUser(userId);
  //     if (payload != null) {
  //       dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  //     } else {
  //       dispatch({ type: 'FAILED_GET' });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  // const addAsset = useCallback(
  // async (userId: number, description: string, value: number) => {
  // try {
  // const { data: payload } = await apiAddAsset(userId, description, value);
  // if (payload != null) {
  // toast.success(`Successful addition of ${description}`);
  // await getAssetsByUser(userId);
  // } else {
  // toast.error(`Could not add ${description}`);
  // }
  // } catch (err) {
  // console.log(err);
  // }
  // },
  // []
  // );

  // const deleteAssetByAssetId = useCallback(
  //   async (assetId: number, userId: number) => {
  //     try {
  //       await apiDeleteAssetByAssetId(assetId);
  //       await getAssetsByUser(userId);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  //   [getAssetsByUser]
  // );

  const value = useMemo(() => {
    return {
      assetsByUser,
      // addAsset,
      // getAssetsByUser,
      // deleteAssetByAssetId,
    };
  }, [assetsByUser /*addAsset, getAssetsByUser, deleteAssetByAssetId*/]);

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
