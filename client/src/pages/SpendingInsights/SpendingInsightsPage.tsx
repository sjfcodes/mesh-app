import { useEffect, useMemo, useState } from 'react';

import CategoriesChart from '../../components/CategoriesChart/CategoriesChart';
import TopVendors from '../../components/TopTransactions/TopTransactions';

import './style.scss';
import useAppContext from '../../hooks/useAppContext';
import useFormattedTransactions from '../../hooks/useFormattedTransactions';
import SectionLoader from '../../components/SectionLoader/SectionLoader';

export default function SpendingInsights() {
  // grab transactions from most recent month and filter out transfers and payments
  const { formattedTxs } = useFormattedTransactions();

  const [filterOptions] = useState([/*'Payment', 'Transfer',*/ 'Interest']);
  const {
    useSectionHeader: [_, setSectionHeader],
  } = useAppContext();

  useEffect(() => {
    setSectionHeader('spending');
  }, [setSectionHeader]);

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
