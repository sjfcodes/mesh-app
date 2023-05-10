import { lazy, Suspense } from 'react';

import './style.scss';

import useFormattedTransactions from '../../hooks/useFormattedTransactions';
import SectionLoader from '../../components/SectionLoader/SectionLoader';

const TxTable = lazy(() => import('../../components/TxTable/TxTable'));

const Timeline = () => {
  const { formattedTxs } = useFormattedTransactions();

  return (
    <Suspense fallback={<SectionLoader />}>
      {formattedTxs.length ? (
        <main id="ma-tx-table">
          <TxTable transactions={formattedTxs} />
        </main>
      ) : (
        <SectionLoader />
      )}
    </Suspense>
  );
};

export default Timeline;
