import { lazy, Suspense } from 'react';

import './style.scss';

import SectionLoader from '../../components/SectionLoader/SectionLoader';
import useTransactions from '../../hooks/usePlaidTransactions';

const TxTable = lazy(() => import('../../components/TxTable/TxTable'));

const Timeline = () => {
  const { formattedTxs } = useTransactions();

  return (
    <Suspense fallback={<SectionLoader />}>
      {!formattedTxs.length ? (
        <SectionLoader />
      ) : (
        <main id="ma-tx-table">
          <TxTable transactions={formattedTxs} />
        </main>
      )}
    </Suspense>
  );
};

export default Timeline;
