import { Institution } from "plaid";

export interface InstitutionsById {
  [key: string]: Institution;
}
export interface InstitutionsState {
  institutionsById: InstitutionsById;
}

export type InstitutionsAction = {
  type: 'SUCCESSFUL_GET';
  payload: Institution;
};

export interface InstitutionsContextShape extends InstitutionsState {
    getItemInstitution: (id: string) => void;
    formatLogoSrc: (src: string | null | undefined) => string;
  }
