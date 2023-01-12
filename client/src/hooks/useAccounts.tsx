import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
  ReactNode,
} from 'react';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import { AccountType } from '../types';
import { getAllItemAccounts as apiGetAccountsByUser } from '../util/api';

interface AccountsState {
  [accountId: number]: AccountType;
}

const initialState: AccountsState = {};
type AccountsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: AccountType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: string }
  | { type: 'DELETE_BY_USER'; payload: string };

interface AccountsContextShape extends AccountsState {
  allAccounts: AccountType[];
  dispatch: Dispatch<AccountsAction>;
  itemAccounts: { [itemId: string]: AccountType[] };
  deleteAccountsByItemId: (itemId: string) => void;
  getAllItemAccounts: (userId: string) => void;
  deleteAccountsByUserId: (userId: string) => void;
}
const AccountsContext = createContext<AccountsContextShape>(
  initialState as AccountsContextShape
);

/**
 * @desc Maintains the Accounts context state and provides functions to update that state.
 */
export const AccountsProvider: React.FC<{ children: ReactNode }> = (
  props: any
) => {
  const [itemAccounts, dispatch] = useReducer(reducer, initialState);

  /**
   * @desc Requests all Accounts that belong to an individual User.
   */
  const getAllItemAccounts = useCallback(async () => {
    const {
      data: {
        body: { accounts: payload },
      },
    } = await apiGetAccountsByUser();
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual Item.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByItemId = useCallback((itemId: string) => {
    dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByUserId = useCallback((userId: string) => {
    dispatch({ type: 'DELETE_BY_USER', payload: userId });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Accounts data. useMemo will prevent
   * these from being rebuilt on every render unless itemAccounts is updated in the reducer.
   */
  const value = useMemo(() => {
    const allAccounts = Object.values(itemAccounts);

    return {
      allAccounts,
      itemAccounts,
      getAllItemAccounts,
      deleteAccountsByItemId,
      deleteAccountsByUserId,
    };
  }, [
    itemAccounts,
    getAllItemAccounts,
    deleteAccountsByItemId,
    deleteAccountsByUserId,
  ]);

  return <AccountsContext.Provider value={value} {...props} />;
};

/**
 * @desc Handles updates to the Accounts state as dictated by dispatched actions.
 */
function reducer(state: AccountsState, action: AccountsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case 'DELETE_BY_ITEM':
      return omitBy(
        state,
        (transaction) => transaction.item_id === action.payload
      );
    case 'DELETE_BY_USER':
      return omitBy(
        state,
        (transaction) => transaction.user_id === action.payload
      );
    default:
      console.warn('unknown action');
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Accounts context state in components.
 */
export default function useAccounts() {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error(`useAccounts must be used within an AccountsProvider`);
  }

  return context;
}
