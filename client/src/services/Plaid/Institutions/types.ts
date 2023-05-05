import { Institution } from 'plaid';
import { ItemId } from '../Items/types';

export type InstitutionId = string;
export type AccountId = string;

export interface InstitutionsById {
  [key: InstitutionId]: Institution;
}
export interface InstitutionsState {
  institutionsById: InstitutionsById;
}

export type InstitutionsAction = {
  type: 'GET_INSTITUTION';
  payload: Institution;
};

export interface InstitutionsContextShape extends InstitutionsState {
  getInstitutionsById: (institutionId: InstitutionId) => void;
  getInstitutionAccountBalances: (itemId: ItemId, accountId?: AccountId) => void;
}
