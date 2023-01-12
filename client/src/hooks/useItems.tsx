import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
import { ItemType } from '../types';
import useApi from './useApi';

interface ItemsState {
  [itemId: string]: ItemType;
}

const initialState = {};
type ItemsAction =
  | {
      type: 'SUCCESSFUL_REQUEST';
      payload: { [item_d: string]: ItemType };
    }
  | { type: 'SUCCESSFUL_DELETE'; payload: string }
  | { type: 'DELETE_BY_USER'; payload: string };

interface ItemsContextShape {
  dispatch: Dispatch<ItemsAction>;
  getAllItems: (userId: string, refresh: boolean) => void;
  plaidItem: { [item_id: string]: ItemType };
}
const ItemsContext = createContext<ItemsContextShape>(
  initialState as ItemsContextShape
);

/**
 * @desc Maintains the Items context state and provides functions to update that state.
 */
export function ItemsProvider(props: any) {
  const { getAllItems: apiGetItemsByUser } = useApi();
  const [plaidItem, dispatch] = useReducer(reducer, {});

  /**
   * @desc Requests all Items that belong to an individual User.
   */
  const getAllItems = useCallback(async () => {
    const {
      data: {
        body: { items },
      },
    } = await apiGetItemsByUser();
    dispatch({ type: 'SUCCESSFUL_REQUEST', payload: items });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Items data. useMemo will prevent
   * these from being rebuilt on every render unless itemsById is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      plaidItem,
      getAllItems,
    };
  }, [plaidItem, getAllItems]);

  return <ItemsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Items state as dictated by dispatched actions.
 */
function reducer(state: ItemsState, action: ItemsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_REQUEST':
      if (!Object.keys(action.payload).length) {
        return state;
      }

      return { ...state, ...action.payload };
    case 'SUCCESSFUL_DELETE':
      return omit(state, [action.payload]);
    case 'DELETE_BY_USER':
      return omitBy(state, (plaidItem) => plaidItem.user_id === action.payload);
    default:
      console.warn('unknown action');
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Items context state in components.
 */
export default function useItems() {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error(`useItems must be used within an ItemsProvider`);
  }

  return context;
}
