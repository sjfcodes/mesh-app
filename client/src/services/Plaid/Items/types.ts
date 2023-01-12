import { AccountType, ItemType } from '../../../types';
export interface ItemsState {
  [itemId: string]: ItemType;
}

export type ItemsAction =
  | {
      type: 'SUCCESSFUL_REQUEST_ITEM';
      payload: { [item_d: string]: ItemType };
    }
  | { type: 'SUCCESSFUL_DELETE_ITEM'; payload: string }
  | {
      type: 'SUCCESSFUL_DELETE_ACCOUNT';
      payload: { itemId: string; accountId: string };
    };

export interface ItemsContextShape {
  plaidItem: { [item_id: string]: ItemType };
  allAccounts: AccountType[];
  getAllItems: (userId: string, refresh: boolean) => void;
  deleteAccountsByUserId: (userId: string) => void;
}
