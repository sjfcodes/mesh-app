import { PlaidTransactionType, TransactionType } from '../../../types';
import { AccountId } from '../Institutions/types';
import { ItemId } from '../Items/types';

export interface TransactionsState {
  [transactionId: number]: PlaidTransactionType;
}

/**
 * string formatted as YYYY-MM-DD
 */
export type DateBand = string;

export type TransactionsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: PlaidTransactionType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: string }
  | { type: 'DELETE_BY_USER'; payload: string };

export type DateBandState = {
  lowerBand: DateBand;
  upperBand: DateBand;
  errorMessage: string;
};
export type DateBandStateAction = {
  lowerBand?: DateBand;
  upperBand?: DateBand;
};

export interface TransactionsContextShape extends TransactionsState {
  loadingMap: { [accountId: AccountId]: boolean };
  allTransactions: TransactionType[];
  itemAccountTransaction: { [accountId: AccountId]: TransactionType[] };
  getTransactionsByAccountId: (
    itemId: ItemId,
    accountId: AccountId,
    refresh?: boolean
  ) => void;
  dateBand: DateBandState;
  setDateBand: (action: DateBandStateAction) => void;
}
