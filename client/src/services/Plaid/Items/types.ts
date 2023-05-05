import { AccountType, ItemType } from '../../../types';

export type ItemId = string;
export type UserId = string;

export interface ItemsState {
  [itemId: ItemId]: ItemType;
}

export type ItemsAction =
  | {
      type: 'SUCCESSFUL_ITEM_GET';
      payload: { [item_d: ItemId]: ItemType };
    }
  | {
      type: 'SUCCESSFUL_ITEM_SYNC';
      payload: { tx_cursor_updated_at: string };
    }
  | { type: 'SUCCESSFUL_DELETE_ITEM'; payload: string }
  | {
      type: 'SUCCESSFUL_ACCOUNT_DELETE';
      payload: { itemId: ItemId; accountId: string };
    };

export interface ItemsContextShape {
  allAccounts: AccountType[];
  lastActivity: string;
  plaidItem: { [item_id: ItemId]: ItemType };
  sortedItems: ItemType[];
  isLoading: boolean;
  getAllItems: (userId: string, refresh: boolean) => void;
  syncItemTransactions: (itemId: ItemId) => void;
}
