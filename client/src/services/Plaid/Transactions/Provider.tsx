import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { TransactionType } from '../../../types';
import { getTransactionsByAccountId as apiGetItemAccountTransactions } from '../../../util/api';
import transactionsReducer from './reducer';
import {
  LoadingMapAction,
  LoadingMapState,
  TransactionsContextShape,
} from './types';
import usePlaidItems from '../../../hooks/usePlaidItems';
import { AccountId } from '../Institutions/types';
import useTxSearchFilter from './useTxSearchFilter';
import { formatLoadingKey } from '../../../util/helpers';
import { ItemId } from '../Items/types';
import useFormatTxs from './useFormatTxs';

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
  const { allAccounts, updateAccounts, setUpdateAccounts } = usePlaidItems();
  const [loadingMap, setLoadingMap] = useReducer(
    (state: LoadingMapState, action: LoadingMapAction) => {
      const key = formatLoadingKey(action.itemId, action.accountId);
      return { ...state, [key]: action.loading };
    },
    {}
  );

  const [itemAccountTransaction, dispatch] = useReducer(
    transactionsReducer,
    initialState
  );

  const hasRequested = useRef<{
    byAccount: { [accountId: AccountId]: boolean };
  }>({
    byAccount: {},
  });

  useEffect(() => {
    /**
     * if an item sync returned a list of accounts to update,
     * loop through accounts and reload txs for each account
     */
    if (!updateAccounts?.length) return;

    updateAccounts
      .map((itemAccountId) => itemAccountId.split('::'))
      .forEach(([itemId, accountId]) =>
        getTransactionsByAccountId(itemId, accountId, true)
      );

    // reset accounts list
    setUpdateAccounts([]);
  }, [updateAccounts]);

  useEffect(() => {
    /**
     * reload already loaded transactions when date bands change
     */
    Object.keys(loadingMap)
      .map((itemAccountId) => itemAccountId.split('::'))
      .forEach(([itemId, accountId]) =>
        getTransactionsByAccountId(itemId, accountId, true)
      );
  }, [dateBand]);

  /**
   * Requests transactions within current filter ranges for an account.
   * Skip request if data has already fetched.
   * Use 'refresh' parameter to force a new request.
   */
  const getTransactionsByAccountId = useCallback(
    async (itemId: ItemId, accountId: AccountId, refresh?: boolean) => {
      setLoadingMap({ itemId, accountId, loading: true });

      if (!hasRequested.current.byAccount[accountId] || refresh) {
        hasRequested.current.byAccount[accountId] = true;
        const {
          data: {
            data: { transactions },
          },
        } = await apiGetItemAccountTransactions(
          itemId,
          accountId,
          dateBand.lowerBand,
          dateBand.upperBand
        );

        const sorted = transactions.sort(
          (
            { transaction: txA }: TransactionType,
            { transaction: txB }: TransactionType
          ) => new Date(txB?.date).getTime() - new Date(txA?.date).getTime()
        );

        dispatch({
          type: 'SUCCESSFUL_GET',
          payload: { accountId, transactions: sorted },
        });
      }
      setLoadingMap({ itemId, accountId, loading: false });
    },
    [dateBand]
  );

  const { formattedTxs } = useFormatTxs({
    allAccounts,
    itemAccountTransaction,
    loadingMap,
    getTransactionsByAccountId,
  });

  /**
   * @desc Builds a more accessible state shape from the Transactions data. useMemo will prevent
   * these from being rebuilt on every render unless itemAccountTransaction is updated in the reducer.
   */
  const value = useMemo(() => {
    return {
      dateBand,
      formattedTxs,
      itemAccountTransaction,
      loadingMap,
      getTransactionsByAccountId,
      setDateBand,
    };
  }, [
    dateBand,
    formattedTxs,
    loadingMap,
    itemAccountTransaction,
    getTransactionsByAccountId,
    setDateBand,
  ]);

  return <TransactionsContext.Provider value={value} {...props} />;
}
