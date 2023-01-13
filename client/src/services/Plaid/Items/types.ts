import { AccountType, ItemType } from '../../../types';
export interface ItemsState {
  [itemId: string]: ItemType;
}

export type ItemsAction =
  | {
      type: 'SUCCESSFUL_ITEM_GET';
      payload: { [item_d: string]: ItemType };
    }
  | {
      type: 'SUCCESSFUL_ITEM_SYNC';
      payload: { tx_cursor_updated_at: string };
    }
  | { type: 'SUCCESSFUL_DELETE_ITEM'; payload: string }
  | {
      type: 'SUCCESSFUL_ACCOUNT_DELETE';
      payload: { itemId: string; accountId: string };
    };

export interface ItemsContextShape {
  plaidItem: { [item_id: string]: ItemType };
  allAccounts: AccountType[];
  getAllItems: (userId: string, refresh: boolean) => void;
  deleteAccountsByUserId: (userId: string) => void;
  syncItemTransactions: (itemId: string) => void;
}
