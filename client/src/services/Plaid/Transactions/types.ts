import { PlaidTransactionType, TransactionType } from '../../../types';

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
  loadingMap: { [accountId: string]: boolean };
  allTransactions: TransactionType[];
  itemAccountTransaction: { [accountId: string]: TransactionType[] };
  getItemAccountTransactions: (
    itemId: string,
    accountId: string,
    refresh?: boolean
  ) => void;
}
