import { AccountType, ItemType } from '../../../types';

export type ItemId = string;
export type UserId = string;
export type TxCursorUpdatedAt = string;
export type UpdatedAccounts = string[];

export interface ItemsState {
  [itemId: ItemId]: ItemType;
}

export type ItemAccountId = string;

export type UpdateAccounts = ItemAccountId[];

export type ItemsAction =
  | {
      type: 'SUCCESSFUL_ITEM_GET';
      payload: { [item_d: ItemId]: ItemType };
    }
  | {
      type: 'SUCCESSFUL_ITEM_SYNC';
      payload: { tx_cursor_updated_at: TxCursorUpdatedAt; item_id: ItemId };
    };

export interface ItemsContextShape {
  allAccounts: AccountType[];
  lastActivity: string;
  plaidItem: { [item_id: ItemId]: ItemType };
  sortedItems: ItemType[];
  isLoading: boolean;
  updateAccounts: UpdateAccounts;
  getItems: (userId: string, refresh: boolean) => void;
  syncTransactionsByItemId: (itemId: ItemId) => void;
  setUpdateAccounts: React.Dispatch<UpdateAccounts>;
}
