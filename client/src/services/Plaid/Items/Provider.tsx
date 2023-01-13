import { createContext, useCallback, useMemo, useReducer } from 'react';

import {
  getAllItems as apiGetItemsByUser,
  syncItemTransactions as apiSyncItemTransactions,
} from '../../../util/api';
import plaidItemsReducer from './reducer';
import { ItemsContextShape, ItemsState } from './types';

export const ItemsContext = createContext<ItemsContextShape>(
  {} as ItemsContextShape
);

/**
 * @desc Maintains the Items context state and provides functions to update that state.
 */
export function ItemsProvider(props: any) {
  const [plaidItem, dispatch] = useReducer(plaidItemsReducer, {} as ItemsState);

  /**
   * @desc Requests all Items that belong to an individual User.
   */
  const getAllItems = useCallback(async () => {
    const {
      data: {
        body: { items },
      },
    } = await apiGetItemsByUser();
    dispatch({ type: 'SUCCESSFUL_ITEM_GET', payload: items });
  }, []);

  const syncItemTransactions = useCallback(async (itemId: string) => {
    const { data } = await apiSyncItemTransactions(itemId);
    console.log(data);
    dispatch({ type: 'SUCCESSFUL_ITEM_SYNC', payload: data });
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByUserId = useCallback(
    (itemId: string, accountId: string) => {
      dispatch({
        type: 'SUCCESSFUL_ACCOUNT_DELETE',
        payload: { itemId, accountId },
      });
    },
    []
  );

  /**
   * @desc Builds a more accessible state shape from the Items data. useMemo will prevent
   * these from being rebuilt on every render unless itemsById is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      plaidItem,
      allAccounts: Object.values(plaidItem).map((item) => item.accounts),
      getAllItems,
      deleteAccountsByUserId,
      syncItemTransactions,
    };
  }, [plaidItem, getAllItems, deleteAccountsByUserId, syncItemTransactions]);

  return <ItemsContext.Provider value={value} {...props} />;
}