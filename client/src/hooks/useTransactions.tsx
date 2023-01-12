import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import { PlaidTransactionType, TransactionType } from '../types';
import { getItemAccountTransactions as apiGetItemAccountTransactions } from '../services/api';

interface TransactionsState {
  [transactionId: number]: PlaidTransactionType;
}

const initialState = {};
type TransactionsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: PlaidTransactionType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: string }
  | { type: 'DELETE_BY_USER'; payload: string };

interface TransactionsContextShape extends TransactionsState {
  dispatch: Dispatch<TransactionsAction>;
  allTransactions: TransactionType[];
  accountTransactions: { [accountId: string]: TransactionType[] };
  getItemAccountTransactions: (
    itemId: string,
    accountId: string,
    refresh?: boolean
  ) => void;
}
const TransactionsContext = createContext<TransactionsContextShape>(
  initialState as TransactionsContextShape
);

/**
 * @desc Maintains the Transactions context state and provides functions to update that state.
 *
 *  The transactions requests below are made from the database only.  Calls to the Plaid transactions/get endpoint are only
 *  made following receipt of transactions webhooks such as 'DEFAULT_UPDATE' or 'INITIAL_UPDATE'.
 */
export function TransactionsProvider(props: any) {
  const [accountTransactions, dispatch] = useReducer(reducer, initialState);

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

    const formatTransactions = (tx: PlaidTransactionType) => {
      const copy = { ...tx };
      removePhrases.forEach((phrase) => {
        if (copy.name?.includes(phrase)) {
          copy.name = copy.name.split(phrase)[1].trim();
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
      dispatch,
      allTransactions,
      accountTransactions,
      getItemAccountTransactions,
    };
  }, [dispatch, accountTransactions, getItemAccountTransactions]);

  return <TransactionsContext.Provider value={value} {...props} />;
}

/**
 * @desc Handles updates to the Transactions state as dictated by dispatched actions.
 */
function reducer(state: TransactionsState, action: TransactionsAction | any) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      const {
        payload: { transactions, accountId },
      } = action;
      if (!transactions.length) {
        return state;
      }
      return {
        ...state,
        [accountId]: transactions,
      };
    default:
      console.warn('unknown action: ', action.type, action.payload);
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Transactions context state in components.
 */
export default function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      `useTransactions must be used within a TransactionsProvider`
    );
  }

  return context;
}
