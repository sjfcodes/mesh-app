import { useEffect, useState } from 'react';
import LoadingSpinner from 'plaid-threads/LoadingSpinner';
import Callout from 'plaid-threads/Callout';

import { pluralize } from '../../util';
import useLink from '../../hooks/useLink';
import useItems from '../../hooks/usePlaidItems';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingCallout from '../../components/LoadingCallout';
import LaunchLink from '../../components/LaunchLink';
import useUser from '../../hooks/useUser';
import useTransactions from '../../hooks/usePlaidTransactions';
import NetWorth from '../../components/NetWorth';
import useAssets from '../../hooks/useAssets';
import TransactionTimeline from '../../components/TransactionTimeline';

import './style.scss';
import ItemCard from '../../components/ItemCard';
import LinkTokenError from '../../components/LinkTokenError';

// import TransactionTimeline from './TransactionTimeline';

// provides view of user's net worth, spending by category and allows them to explore
// account and transactions details for linked sortedItems

const UserPage = () => {
  const { user } = useUser();

  const userId = user.sub;
  const [token, setToken] = useState('');

  const { allTransactions } = useTransactions();
  const { assets } = useAssets();
  const { sortedItems, allAccounts } = useItems();
  const { linkTokens /* generateLinkToken */ } = useLink();

  // const initiateLink = async () => {
  //   // only generate a link token upon a click from enduser to add a bank;
  //   // if done earlier, it may expire before enduser actually activates Link to add a bank.
  //   await generateLinkToken(userId, null);
  // };

  useEffect(() => {
    setToken(linkTokens.byUser[userId]);
  }, [linkTokens, userId]);

  document.getElementsByTagName('body')[0].style.overflow = 'auto'; // to override overflow:hidden from link pane
  return (
    <main>
      {linkTokens.error.error_code != null && (
        <LinkTokenError error={linkTokens.error} />
      )}
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

            {token != null && token.length > 0 && (
              // Link will not render unless there is a link token
              <LaunchLink token={token} userId={userId} itemId={null} />
            )}
          </div>
          <ErrorMessage />
          {sortedItems.map((item) => (
            <div id="itemCards" key={item.id}>
              <ItemCard item={item} />
            </div>
          ))}
          <TransactionTimeline />
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
