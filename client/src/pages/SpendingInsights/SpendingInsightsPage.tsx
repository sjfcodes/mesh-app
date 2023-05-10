import { useMemo, useState } from 'react';

import CategoriesChart from '../../components/CategoriesChart/CategoriesChart';
import TopVendors from '../../components/TxTopX/TxTopX';

import useFormattedTransactions from '../../hooks/useFormattedTransactions';
import SectionLoader from '../../components/SectionLoader/SectionLoader';

import './style.scss';

export default function SpendingInsights() {
  // grab transactions from most recent month and filter out transfers and payments
  const { formattedTxs } = useFormattedTransactions();

  const [filterOptions] = useState([/*'Payment', 'Transfer',*/ 'Interest']);

  const filteredTransactions = useMemo(
    () =>
      formattedTxs.filter((txData) => {
        const { transaction: tx } = txData;
        const date = new Date(tx.date);
        const today = new Date();
        const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
        return date > oneMonthAgo && !filterOptions.includes(tx.category[0]);
      }),
    [formattedTxs, filterOptions]
  );

  return (
    <main className="spending-insights">
      {filteredTransactions.length ? (
        <>
          <CategoriesChart filteredTransactions={filteredTransactions} />
          <TopVendors filteredTransactions={filteredTransactions} />
        </>
      ) : (
        <SectionLoader />
      )}
    </main>
  );
}
