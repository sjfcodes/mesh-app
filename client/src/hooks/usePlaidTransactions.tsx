import { useContext } from 'react';
import { TransactionsContext } from '../services/Plaid/Transactions/Provider';

/**
 * @desc A convenience hook to provide access to the Transactions context state in components.
 */
const useTransactions = () => {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      `useTransactions must be used within a TransactionsProvider`
    );
  }

  return context;
};

export default useTransactions;
