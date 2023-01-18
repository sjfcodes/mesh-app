import LoadingSpinner from 'plaid-threads/LoadingSpinner';

import { pluralize } from '../../util';
import useItems from '../../hooks/usePlaidItems';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingCallout from '../../components/LoadingCallout';
import useUser from '../../hooks/useUser';
import useTransactions from '../../hooks/usePlaidTransactions';
import NetWorth from '../../components/NetWorth';
import useAssets from '../../hooks/useAssets';

import './style.scss';
import ItemCard from '../../components/ItemCard/ItemCard';

const UserPage = () => {
  const { user } = useUser();

  const userId = user.sub;

  const { allTransactions } = useTransactions();
  const { assets } = useAssets();
  const { sortedItems, allAccounts } = useItems();

  document.getElementsByTagName('body')[0].style.overflow = 'auto'; // to override overflow:hidden from link pane
  return (
    <main>
      {sortedItems.length === 0 && <ErrorMessage />}
      {sortedItems.length > 0 && (
        <>
          <div className="item__header">
            <div>
              <h2 className="item__header-heading">
                {`${sortedItems.length} ${pluralize(
                  'Bank',
                  sortedItems.length
                )} Linked`}
              </h2>
              {!!sortedItems.length && (
                <p className="item__header-subheading">
                  Below is a list of all your connected banks. Click on a bank
                  to view its associated accounts.
                </p>
              )}
            </div>
          </div>
          <ErrorMessage />
          {sortedItems.map((item) => (
            <div id="itemCards" key={item.id}>
              <ItemCard item={item} />
            </div>
          ))}
        </>
      )}

      {sortedItems.length > 0 && allTransactions.length === 0 && (
        <div className="loading">
          <LoadingSpinner />
          <LoadingCallout />
        </div>
      )}
      {sortedItems.length > 0 && allTransactions.length > 0 && (
        <>
          <NetWorth
            accounts={allAccounts}
            numOfItems={sortedItems.length}
            personalAssets={assets}
            userId={userId}
            assetsOnly={false}
          />
        </>
      )}
      {sortedItems.length === 0 &&
        allTransactions.length === 0 &&
        assets.length > 0 && (
          <>
            <NetWorth
              accounts={allAccounts}
              numOfItems={sortedItems.length}
              personalAssets={assets}
              userId={userId}
              assetsOnly
            />
          </>
        )}
    </main>
  );
};

export default UserPage;
