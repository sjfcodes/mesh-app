import { Suspense, lazy, useEffect } from 'react';
import ButtonLinkBank from '../../components/ButtonLinkBank/ButtonLinkBank';
import ItemCard from '../../components/ItemCard/ItemCard';
import Loader from '../../components/Loader/Loader';
import useAppContext from '../../hooks/useAppContext';
import usePlaidItems from '../../hooks/usePlaidItems';
import SectionLoader from '../../components/SectionLoader/SectionLoader';

import './style.scss';

const TxSearchFilter = lazy(
  () => import('../../components/TxSearchFilter/TxSearchFilter')
);

const PlaidItemsPage = () => {
  const { sortedItems } = usePlaidItems();
  const {
    useSectionHeader: [_, setSectionHeader],
  } = useAppContext();

  useEffect(() => {
    setSectionHeader('accounts');
  }, [setSectionHeader]);

  if (!sortedItems.length) {
    return <Loader />;
  }

  return (
    <Suspense>
      {sortedItems.length && <TxSearchFilter />}
      <main id="ma-plaid-items-page">
        {sortedItems.length ? (
          <>
            <div>
              {sortedItems.map((item) => (
                <div id="itemCards" key={item.id}>
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
            <div className="add-item">
              <ButtonLinkBank />
            </div>
          </>
        ) : (
          <SectionLoader />
        )}
      </main>
    </Suspense>
  );
};

export default PlaidItemsPage;
