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
  getItems as apiGetItemsByUser,
  syncTransactionsByItemId as apiSyncItemTransactions,
} from '../../../util/api';
import plaidItemsReducer from './reducer';
import { ItemId, ItemsContextShape, ItemsState, UpdateAccounts } from './types';
import { AccountId } from '../Institutions/types';

export const ItemsContext = createContext<ItemsContextShape>(
  {} as ItemsContextShape
);

/**
 * @desc Maintains the Items context state and provides functions to update that state.
 */
export function ItemsProvider(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [plaidItem, dispatch] = useReducer(plaidItemsReducer, {} as ItemsState);
  const [sortedItems, setSortedItems] = useState([] as ItemType[]);
  const [lastActivity, setLastActivity] = useState('');
  const [updateAccounts, setUpdateAccounts] = useState({} as UpdateAccounts);

  /**
   * @desc Requests all Items that belong to an individual User.
   */
  const getItems = useCallback(async () => {
    setIsLoading(true);
    const {
      data: { data },
    } = await apiGetItemsByUser();
    dispatch({
      type: 'SUCCESSFUL_ITEM_GET',
      payload: data.items,
    });
    setLastActivity(data.last_activity);
    setIsLoading(false);
  }, []);

  const syncTransactionsByItemId = useCallback(async (itemId: ItemId) => {
    setIsLoading(true);
    const {
      data: { data },
    } = await apiSyncItemTransactions(itemId);
    if (data.updated_accounts.length) {
      setUpdateAccounts({
        ...updateAccounts,
        [itemId]: data.updated_accounts as AccountId[],
      });
    }
    setLastActivity(data.tx_cursor_updated_at);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getItems();
  }, [getItems]);

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
      isLoading,
      updateAccounts,
      getItems,
      syncTransactionsByItemId,
      setUpdateAccounts,
    };
  }, [
    lastActivity,
    plaidItem,
    sortedItems,
    isLoading,
    updateAccounts,
    getItems,
    syncTransactionsByItemId,
    setUpdateAccounts,
  ]);

  return <ItemsContext.Provider value={value} {...props} />;
}
