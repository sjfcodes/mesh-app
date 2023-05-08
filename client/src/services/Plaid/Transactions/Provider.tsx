import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { TransactionType } from '../../../types';
import { getTransactionsByAccountId as apiGetItemAccountTransactions } from '../../../util/api';
import transactionsReducer from './reducer';
import { TransactionsContextShape } from './types';
import usePlaidItems from '../../../hooks/usePlaidItems';
import { ItemId, UpdateAccounts } from '../Items/types';
import { AccountId } from '../Institutions/types';
import useTxSearchFilter from './useTxSearchFilter';

const initialState = {};

export const TransactionsContext = createContext<TransactionsContextShape>(
  initialState as TransactionsContextShape
);

/**
 * @desc Maintains the Transactions context state and provides functions to update that state.
 *
 *  The transactions requests below are made from the database only.  Calls to the Plaid transactions/get endpoint are only
 *  made following receipt of transactions webhooks such as 'DEFAULT_UPDATE' or 'INITIAL_UPDATE'.
 */
export function TransactionsProvider(props: any) {
  const [dateBand, setDateBand] = useTxSearchFilter();
  const { updateAccounts, setUpdateAccounts } = usePlaidItems();
  const [loadingMap, setLoadingMap] = useState({});
  const [itemAccountTransaction, dispatch] = useReducer(
    transactionsReducer,
    initialState
  );

  useEffect(() => {
    console.log({ dateBand });
  }, [dateBand]);

  const hasRequested = useRef<{
    byAccount: { [accountId: AccountId]: boolean };
  }>({
    byAccount: {},
  });

  useEffect(() => {
    /**
     * if an item sync returns a list of accounts to update,
     * loop through accounts and reload txs for each account
     */
    const itemIds = Object.keys(updateAccounts);
    if (!itemIds?.length) return;
    itemIds.forEach((itemId) => {
      const accountIds = updateAccounts[itemId];
      if (!accountIds?.length) return;

      accountIds.forEach((accountId) => {
        getTransactionsByAccountId(itemId, accountId, true);
      });
      const shallowCopy = { ...updateAccounts } as UpdateAccounts;
      delete shallowCopy[itemId];
      setUpdateAccounts(shallowCopy);
    });
  }, [updateAccounts]);

  /**
   * @desc Requests all Transactions that belong to an individual Account.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getTransactionsByAccountId = useCallback(
    async (itemId: ItemId, accountId: AccountId, refresh: boolean) => {
      setLoadingMap({
        ...loadingMap,
        [accountId]: true,
      });
      if (!hasRequested.current.byAccount[accountId] || refresh) {
        hasRequested.current.byAccount[accountId] = true;
        const {
          data: {
            data: { transactions },
          },
        } = await apiGetItemAccountTransactions(itemId, accountId);
        dispatch({
          type: 'SUCCESSFUL_GET',
          payload: { transactions, accountId },
        });
      }
      setLoadingMap({
        ...loadingMap,
        [accountId]: false,
      });
    },
    []
  );

  /**
   * @desc Builds a more accessible state shape from the Transactions data. useMemo will prevent
   * these from being rebuilt on every render unless itemAccountTransaction is updated in the reducer.
   */
  const value = useMemo(() => {
    const removePhrases = ['MEMO=', 'Withdrawal -', 'Deposit -'];

    const formatTransactions = (tx: TransactionType) => {
      const copy = { ...tx };
      removePhrases.forEach((phrase) => {
        if (copy.transaction.name?.includes(phrase)) {
          copy.transaction.name = copy.transaction.name.split(phrase)[1].trim();
        }
      });

      return copy;
    };

    const allTransactions = Object.values(itemAccountTransaction)
      .reduce((prev, curr) => {
        const formatted = curr.map(formatTransactions);
        return [...prev, ...formatted];
      }, [])
      .sort(
        (
          { transaction: txA }: TransactionType,
          { transaction: txB }: TransactionType
        ) => new Date(txB?.date).getTime() - new Date(txA?.date).getTime()
      );

    return {
      loadingMap,
      allTransactions,
      itemAccountTransaction,
      getTransactionsByAccountId,
      dateBand,
      setDateBand,
    };
  }, [
    loadingMap,
    itemAccountTransaction,
    getTransactionsByAccountId,
    dateBand,
    setDateBand,
  ]);

  return <TransactionsContext.Provider value={value} {...props} />;
}
