import { PlaidLinkError } from 'react-plaid-link';

export interface LinkToken {
  [key: string]: string;
}

export interface LinkState {
  byUser: LinkToken;
  byItem: LinkToken;
  error: PlaidLinkError;
}

export type LinkAction =
  | {
      type: 'LINK_TOKEN_CREATED';
      id: string;
      token: string;
    }
  | { type: 'LINK_TOKEN_UPDATE_MODE_CREATED'; id: string; token: string }
  | { type: 'LINK_TOKEN_ERROR'; error: PlaidLinkError }
  | { type: 'DELETE_USER_LINK_TOKEN'; id: string }
  | { type: 'DELETE_ITEM_LINK_TOKEN'; id: string };

export interface LinkContextShape extends LinkState {
  isLoading: boolean;
  linkTokens: LinkState;
  deleteLinkToken: (userId: string | null, itemId: string | null) => void;
  generateLinkToken: (userId: string, itemId: string | null) => Promise<void>;
}
