import { PlaidTransactionType, TransactionType } from '../../../types';
import { AccountId } from '../Institutions/types';
import { ItemAccountId, ItemId } from '../Items/types';

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

export type LoadingMapState = {
  [key: ItemAccountId]: boolean;
};
export type LoadingMapAction = {
  itemId: ItemId;
  accountId: AccountId;
  loading: boolean;
};

export interface TransactionsContextShape extends TransactionsState {
  loadingMap: { [itemAccountId: ItemAccountId]: boolean };
  setLoadingMap: (
    state: LoadingMapState,
    action: LoadingMapAction
  ) => LoadingMapState;
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
