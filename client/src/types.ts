export interface AssetType {
  id: string;
  user_id: string;
  value: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AccountType {
  id: string;
  item_id: string;
  user_id: string;
  plaid_account_id: string;
  name: string;
  mask: string;
  official_name: string;
  current_balance: number;
  available_balance: number;
  iso_currency_code: string;
  unofficial_currency_code: string;
  type: 'depository' | 'investment' | 'loan' | 'credit';
  subtype:
    | 'checking'
    | 'savings'
    | 'cd'
    | 'money market'
    | 'ira'
    | '401k'
    | 'student'
    | 'mortgage'
    | 'credit card';
  created_at: string;
  updated_at: string;
}

export interface ItemType {
  id: string;
  plaid_item_id: string;
  user_id: string;
  plaid_access_token: string;
  plaid_institution_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RouteInfo {
  userId: string;
}

export interface ItemType {
  id: string;
  plaid_item_id: string;
  user_id: string;
  plaid_access_token: string;
  plaid_institution_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UserType {
  id: string;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export interface RouteInfo {
  userId: string;
}

export interface TransactionType {
  id: string /** db added */;
  account_id: string;
  item_id: string /** manually added */;
  user_id: string /** manually added */;
  plaid_transaction_id: string /** originally transaction_id */;
  plaid_category_id: string /** originally category_id */;
  category: string;
  subcategory: string /** QUESTION: what is this?*/;
  type: string /** QUESTION: what is this? */;
  name: string;
  amount: number;
  iso_currency_code: string;
  unofficial_currency_code: string;
  date: string;
  pending: boolean;
  account_owner: string;
  created_at: string;
  updated_at: string;
}
