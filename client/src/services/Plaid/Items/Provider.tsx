import { createContext, useCallback, useMemo, useReducer } from "react";

import { getAllItems as apiGetItemsByUser } from '../../../util/api';
import plaidItemsReducer from "./reducer";
import { ItemsContextShape } from "./types";

const initialState = {};

export const ItemsContext = createContext<ItemsContextShape>(
  initialState as ItemsContextShape
);

/**
 * @desc Maintains the Items context state and provides functions to update that state.
 */
export function ItemsProvider(props: any) {
  const [plaidItem, dispatch] = useReducer(plaidItemsReducer, initialState);

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