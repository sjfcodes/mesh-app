import { Institution, AccountBase } from 'plaid';
import { ItemId } from '../Items/types';

export type InstitutionId = string;
export type AccountId = string;

export interface InstitutionsById {
  [key: InstitutionId]: Institution;
}

export type InstitutionsAction = {
  type: 'GET_INSTITUTION';
  payload: Institution;
};

export interface InstitutionsContextShape {
  accountBalances: AccountBase[];
  institutionsById: InstitutionsById;
  getInstitutionById: (institutionId: InstitutionId) => void;
  getBalancesByAccountId: (itemId: ItemId, accountId?: AccountId) => void;
}
