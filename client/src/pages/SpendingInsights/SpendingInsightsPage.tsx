import { useMemo } from 'react';

import CategoriesChart from '../../components/CategoriesChart/CategoriesChart';
import useTransactions from '../../hooks/usePlaidTransactions';

import './style.scss';
import TopVendors from '../../components/TopVendors/TopVendors';

export default function SpendingInsights() {
  // grab transactions from most recent month and filter out transfers and payments
  const { allTransactions } = useTransactions();

  const filteredTransactions = useMemo(
    () =>
      allTransactions.filter((txData) => {
        const { transaction: tx } = txData;
        const date = new Date(tx.date);
        const today = new Date();
        const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
        return (
          date > oneMonthAgo &&
          // tx.category[0] !== 'Payment' &&
          tx.category[0] !== 'Transfer' &&
          tx.category[0] !== 'Interest'
        );
      }),
    [allTransactions]
  );

  return (
    <main className="spending-insights">
      <h2>Monthly Spending</h2>
      <CategoriesChart filteredTransactions={filteredTransactions} />
      <TopVendors filteredTransactions={filteredTransactions} />
    </main>
  );
}
