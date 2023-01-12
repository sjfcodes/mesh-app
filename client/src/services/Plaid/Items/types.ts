import { ItemType } from "../../../types";

export interface ItemsState {
  [itemId: string]: ItemType;
}

export type ItemsAction =
  | {
      type: 'SUCCESSFUL_REQUEST';
      payload: { [item_d: string]: ItemType };
    }
  | { type: 'SUCCESSFUL_DELETE'; payload: string }
  | { type: 'DELETE_BY_USER'; payload: string };

export interface ItemsContextShape {
  getAllItems: (userId: string, refresh: boolean) => void;
  plaidItem: { [item_id: string]: ItemType };
}
