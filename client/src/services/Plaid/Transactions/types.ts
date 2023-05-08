import { PlaidTransactionType, TransactionType } from '../../../types';
import { AccountId } from '../Institutions/types';
import { ItemId } from '../Items/types';

export interface TransactionsState {
  [transactionId: number]: PlaidTransactionType;
}

export type TransactionsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: PlaidTransactionType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: string }
  | { type: 'DELETE_BY_USER'; payload: string };

export interface TransactionsContextShape extends TransactionsState {
  loadingMap: { [accountId: AccountId]: boolean };
  allTransactions: TransactionType[];
  itemAccountTransaction: { [accountId: AccountId]: TransactionType[] };
  getTransactionsByAccountId: (
    itemId: ItemId,
    accountId: AccountId,
    refresh?: boolean
  ) => void;
}
