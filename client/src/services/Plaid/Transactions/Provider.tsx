import { createContext, useCallback, useMemo, useReducer, useRef } from 'react';
import { TransactionType } from '../../../types';
import { getItemAccountTransactions as apiGetItemAccountTransactions } from '../../../util/api';
import transactionsReducer from './reducer';
import { TransactionsContextShape } from './types';

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
  const [accountTransactions, dispatch] = useReducer(
    transactionsReducer,
    initialState
  );

  const hasRequested = useRef<{
    byAccount: { [accountId: string]: boolean };
  }>({
    byAccount: {},
  });

  /**
   * @desc Requests all Transactions that belong to an individual Account.
   * The api request will be bypassed if the data has already been fetched.
   * A 'refresh' parameter can force a request for new data even if local state exists.
   */
  const getItemAccountTransactions = useCallback(
    async (itemId: string, accountId: string, refresh: boolean) => {
      if (!hasRequested.current.byAccount[accountId] || refresh) {
        hasRequested.current.byAccount[accountId] = true;
        const {
          data: {
            body: { transactions },
          },
        } = await apiGetItemAccountTransactions(itemId, accountId);
        dispatch({
          type: 'SUCCESSFUL_GET',
          payload: { transactions, accountId },
        });
      }
    },
    []
  );

  /**
   * @desc Builds a more accessible state shape from the Transactions data. useMemo will prevent
   * these from being rebuilt on every render unless accountTransactions is updated in the reducer.
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

    const allTransactions = Object.values(accountTransactions)
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
      allTransactions,
      accountTransactions,
      getItemAccountTransactions,
    };
  }, [accountTransactions, getItemAccountTransactions]);

  return <TransactionsContext.Provider value={value} {...props} />;
}
