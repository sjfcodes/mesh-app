import { useEffect, lazy, Suspense } from 'react';

import useFormattedTransactions from '../../hooks/useFormattedTransactions';
import useAppContext from '../../hooks/useAppContext';
import SectionLoader from '../../components/SectionLoader/SectionLoader';

const TxSearchFilter = lazy(
  () => import('../../components/TxSearchFilter/TxSearchFilter')
);

const TransactionsTable = lazy(
  () => import('../../components/TransactionTable/TransactionsTable')
);

const Timeline = () => {
  const { formattedTxs } = useFormattedTransactions();
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useSectionHeader: [_, setSectionHeader],
  } = useAppContext();

  useEffect(() => {
    setSectionHeader('timeline');
  }, [setSectionHeader]);

  return (
    <Suspense fallback={<SectionLoader />}>
      {formattedTxs.length && <TxSearchFilter />}

      {formattedTxs.length ? (
        <TransactionsTable transactions={formattedTxs} />
      ) : (
        <SectionLoader />
      )}
    </Suspense>
  );
};

export default Timeline;
