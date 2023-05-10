import { lazy, Suspense } from 'react';

import useFormattedTransactions from '../../hooks/useFormattedTransactions';
import SectionLoader from '../../components/SectionLoader/SectionLoader';

const TransactionsTable = lazy(
  () => import('../../components/TransactionTable/TransactionsTable')
);

const Timeline = () => {
  const { formattedTxs } = useFormattedTransactions();

  return (
    <Suspense fallback={<SectionLoader />}>
      {formattedTxs.length ? (
        <TransactionsTable transactions={formattedTxs} />
      ) : (
        <SectionLoader />
      )}
    </Suspense>
  );
};

export default Timeline;
