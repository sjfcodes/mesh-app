import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import LoadingSpinner from 'plaid-threads/LoadingSpinner';
import Callout from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';

import { pluralize } from '../util';

import { ItemType } from '../types';

import useLink from '../hooks/useLink';
import useItems from '../hooks/usePlaidItems';
import UserCard from '../components/UserCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingCallout from '../components/LoadingCallout';
import LaunchLink from '../components/LaunchLink';
import ItemCard from '../components/ItemCard';
import { useAppContext } from '../hooks/useUser';
import useTransactions from '../hooks/usePlaidTransactions';
import Header from '../components/Header/Header';
import useAccounts from '../hooks/usePlaidAccounts';
import NetWorth from '../components/NetWorth';
import SpendingInsights from '../components/SpendingInsights';
import useAssets from '../hooks/useAssets';
import TransactionTimeline from '../components/TransactionTimeline';

// import TransactionTimeline from './TransactionTimeline';

// provides view of user's net worth, spending by category and allows them to explore
// account and transactions details for linked sortedItems

const UserPage = () => {
  const {
    useUser: [{ attributes }],
  } = useAppContext();

  const [user] = useState({
    id: attributes?.sub || '',
    username: '',
    created_at: '',
    updated_at: '',
  });
  const userId = user.id;
  const [sortedItems, setSortedItems] = useState([] as ItemType[]);
  const [token, setToken] = useState('');

  const { allTransactions } = useTransactions();
  const { allAccounts, getAllItemAccounts } = useAccounts();
  const { assets } = useAssets();
  const { plaidItem, getAllItems } = useItems();
  const { linkTokens, generateLinkToken } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };

  // update data store with the user's sortedItems
  useEffect(() => {
    if (userId != null) {
      getAllItems(userId, true);
    }
  }, [getAllItems, userId]);

  // update state sortedItems from data store
  useEffect(() => {
    const newItems: ItemType[] = plaidItem ? Object.values(plaidItem) : [];
    const orderedItems = sortBy(
      newItems,
      (item) => new Date(item.updated_at)
    ).reverse();
    setSortedItems(orderedItems);
  }, [plaidItem]);

  // // update data store with the user's accounts
  useEffect(() => {
    getAllItemAccounts(userId);
  }, [getAllItemAccounts, userId]);

  useEffect(() => {
    setToken(linkTokens.byUser[userId]);
  }, [linkTokens, userId]);

  document.getElementsByTagName('body')[0].style.overflow = 'auto'; // to override overflow:hidden from link pane
  return (
    <div>
      <Header />
      <h1>Mesh</h1>

      {linkTokens.error.error_code != null && (
        <Callout warning>
          <div>
            Unable to fetch link_token: please make sure your backend server is
            running and that your .env file has been configured correctly.
          </div>
          <div>
            Error Code: <code>{linkTokens.error.error_code}</code>
          </div>
          <div>
            Error Type: <code>{linkTokens.error.error_type}</code>{' '}
          </div>
          <div>Error Message: {linkTokens.error.error_message}</div>
        </Callout>
      )}
      <UserCard user={user} userId={userId} removeButton={false} linkButton />
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

            <Button
              large
              inline
              className="add-account__button"
              onClick={initiateLink}
            >
              Add another bank
            </Button>

            {token != null && token.length > 0 && (
              // Link will not render unless there is a link token
              <LaunchLink token={token} userId={userId} itemId={null} />
            )}
          </div>
          <ErrorMessage />
          {sortedItems.map((item) => (
            <div id="itemCards" key={item.id}>
              <ItemCard item={item} userId={userId} />
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
          <SpendingInsights
            numOfItems={sortedItems.length}
            transactions={allTransactions}
          />
        </>
      )}
      {/* {sortedItems.length === 0 &&
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
        )} */}
    </div>
  );
};

export default UserPage;
