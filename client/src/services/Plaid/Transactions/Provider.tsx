import { createContext, useEffect, useMemo, useReducer, useRef } from 'react';

import usePlaidItems from '../../../hooks/usePlaidItems';
import { AccountId } from '../Institutions/types';
import { loadingMapReducer, transactionsReducer } from './reducer';
import { TransactionsContextShape } from './types';
import useFormatTxs from './useFormatTxs';
import useGetTxsByAccountId from './useGetTxsByAccountId';
import useTxSearchFilter from './useTxSearchFilter';

const initialState = {};

export const TransactionsContext = createContext<TransactionsContextShape>(
  initialState as TransactionsContextShape
);

export function TransactionsProvider(props: any) {
  const [dateBand, setDateBand] = useTxSearchFilter();
  const { updateAccounts, setUpdateAccounts } = usePlaidItems();
  const [loadingMap, setLoadingMap] = useReducer(loadingMapReducer, {});
  const [itemAccountTransaction, dispatch] = useReducer(
    transactionsReducer,
    initialState
  );

  const hasRequested = useRef<{
    byAccount: { [accountId: AccountId]: boolean };
  }>({
    byAccount: {},
  });

  const { getTxsByAccountId } = useGetTxsByAccountId({
    dateBand,
    dispatch,
    hasRequested,
    setLoadingMap,
  });

  useEffect(() => {
    /**
     * if an item sync returned a list of accounts to update,
     * loop through accounts and reload txs for each account
     */
    if (updateAccounts.length) {
      updateAccounts
        .map((itemAccountId) => itemAccountId.split('::'))
        .forEach(([itemId, accountId]) =>
          getTxsByAccountId(itemId, accountId, true)
        );

      // reset accounts list
      setUpdateAccounts([]);
    }
  }, [updateAccounts]);

  useEffect(() => {
    // reload transactions when date bands change
    if (loadingMap) {
      Object.keys(loadingMap)
        .map((itemAccountId) => itemAccountId.split('::'))
        .forEach(([itemId, accountId]) =>
          getTxsByAccountId(itemId, accountId, true)
        );
    }
  }, [dateBand]);

  const { formattedTxs } = useFormatTxs({
    itemAccountTransaction,
    loadingMap,
    getTxsByAccountId,
  });

  const memo = useMemo(() => {
    return {
      dateBand,
      formattedTxs,
      itemAccountTransaction,
      loadingMap,
      getTxsByAccountId,
      setDateBand,
    };
  }, [
    dateBand,
    formattedTxs,
    loadingMap,
    itemAccountTransaction,
    getTxsByAccountId,
    setDateBand,
  ]);

  return <TransactionsContext.Provider value={memo} {...props} />;
}
