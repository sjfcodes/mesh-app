import { useMemo, useState } from 'react';

import CategoriesChart from '../../components/CategoriesChart/CategoriesChart';
import useTransactions from '../../hooks/usePlaidTransactions';
import TopVendors from '../../components/TopTransactions/TopTransactions';

import './style.scss';
// import SectionHeader from '../../components/SectionHeader/SectionHeader';

export default function SpendingInsights() {
  // grab transactions from most recent month and filter out transfers and payments
  const { allTransactions } = useTransactions();
  const [filterOptions] = useState([/*'Payment', 'Transfer',*/ 'Interest']);

  const filteredTransactions = useMemo(
    () =>
      allTransactions.filter((txData) => {
        const { transaction: tx } = txData;
        const date = new Date(tx.date);
        const today = new Date();
        const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
        return date > oneMonthAgo && !filterOptions.includes(tx.category[0]);
      }),
    [allTransactions, filterOptions]
  );

  return (
    <main className="spending-insights">
      {/* <SectionHeader text="categories" /> */}
      <CategoriesChart filteredTransactions={filteredTransactions} />
      <TopVendors filteredTransactions={filteredTransactions} />
    </main>
  );
}
