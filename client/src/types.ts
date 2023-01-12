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
  accounts: AccountType[];
  institution_id: string;
  tx_cursor: string;
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

export type LocationType = {
  address: string | null;
  city: string | null;
  country: string | null;
  lat: string | null;
  lon: string | null;
  postal_code: string | null;
  region: string | null;
  store_number: string | null;
};

export type PaymentMetaType = {
  by_order_of: string | null;
  payee: string | null;
  payer: string | null;
  payment_method: string | null;
  payment_processor: string | null;
  ppd_id: string | null;
  reason: string | null;
  reference_number: string | null;
};

export interface PlaidTransactionType {
  account_id: string;
  account_owner: string;
  amount: number;
  authorized_date: string;
  authorized_datetime: string | null;
  category: string[];
  category_id: string /** originally category_id */;
  check_number: number | null;
  date: string;
  datetime: string | null;
  iso_currency_code: string;
  location: LocationType;
  merchant_name: string;
  name: string;
  payment_channel: string;
  payment_meta: PaymentMetaType;
  pending: boolean;
  pending_transaction_id: string | null;
  personal_finance_category: null;
  transaction_code: null;
  transaction_id: string;
  transaction_type: string;
  unofficial_currency_code: string;
}

export type TransactionType = {
  ['item_id::account_id']: string;
  transaction_id: string;
  transaction: PlaidTransactionType;
  created_at: string;
  updated_at: string;
};
