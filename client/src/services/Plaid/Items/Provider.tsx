import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import sortBy from 'lodash/sortBy';

import { ItemType } from '../../../types';
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
  const [sortedItems, setSortedItems] = useState([] as ItemType[]);
  const [lastActivity, setLastActivity] = useState('');

  /**
   * @desc Requests all Items that belong to an individual User.
   */
  const getAllItems = useCallback(async () => {
    const {
      data: {
        body: { items, last_activity },
      },
    } = await apiGetItemsByUser();
    setLastActivity(last_activity);
    dispatch({
      type: 'SUCCESSFUL_ITEM_GET',
      payload: items,
    });
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

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  // update state sortedItems from data store
  useEffect(() => {
    const newItems: ItemType[] = plaidItem ? Object.values(plaidItem) : [];
    const orderedItems = sortBy(
      newItems,
      (item) => new Date(item.updated_at)
    ).reverse();
    setSortedItems(orderedItems);
  }, [plaidItem]);

  /**
   * @desc Builds a more accessible state shape from the Items data. useMemo will prevent
   * these from being rebuilt on every render unless itemsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const itemsAccounts = Object.values(plaidItem).map((item) => item.accounts);
    const allAccounts = itemsAccounts.reduce(
      (list, accounts) => [...list, ...accounts],
      []
    );
    return {
      allAccounts,
      lastActivity,
      plaidItem,
      sortedItems,
      getAllItems,
      deleteAccountsByUserId,
      syncItemTransactions,
    };
  }, [
    lastActivity,
    plaidItem,
    sortedItems,
    getAllItems,
    deleteAccountsByUserId,
    syncItemTransactions,
  ]);

  return <ItemsContext.Provider value={value} {...props} />;
}
