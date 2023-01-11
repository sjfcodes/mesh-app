import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';

import LoadingSpinner from 'plaid-threads/LoadingSpinner';
import Callout from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';

import { pluralize } from '../util';

import { AssetType, ItemType } from '../types';

import useLink from '../hooks/useLink';
import useItems from '../hooks/useItems';
import UserCard from '../components/UserCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingCallout from '../components/LoadingCallout';
import LaunchLink from '../components/LaunchLink';
import ItemCard from '../components/ItemCard';
import { useAppContext } from '../hooks/useUser';
import useTransactions from '../hooks/useTransactions';
import Header from '../components/Header/Header';
import useAccounts from '../hooks/useAccounts';
import NetWorth from '../components/NetWorth';
import SpendingInsights from '../components/SpendingInsights';
import useAssets from '../hooks/useAssets';
import TransactionTimeline from '../components/TransactionTimeline';

// import TransactionTimeline from './TransactionTimeline';

// provides view of user's net worth, spending by category and allows them to explore
// account and transactions details for linked items

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
  const [items, setItems] = useState<ItemType[]>([]);
  const [token, setToken] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [assets, setAssets] = useState<AssetType[]>([]);

  const { transactionsByUser, getTransactionsByUser } = useTransactions();
  const { allAccounts, getAccountsByUser } = useAccounts();
  const { assetsByUser, getAssetsByUser } = useAssets();
  const { itemsByUser, getItemsByUser } = useItems();
  const { linkTokens, generateLinkToken } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };

  useEffect(() => {
    // This gets transactions from the database only.
    // Note that calls to Plaid's transactions/get endpoint are only made in response
    // to receipt of a transactions webhook.
    getTransactionsByUser(userId);
  }, [getTransactionsByUser, userId]);

  useEffect(() => {
    setTransactions(transactionsByUser[userId] || []);
  }, [transactionsByUser, userId]);

  // update data store with the user's assets
  useEffect(() => {
    getAssetsByUser(userId);
  }, [getAssetsByUser, userId]);

  useEffect(() => {
    setAssets(assetsByUser.assets || []);
  }, [assetsByUser, userId]);

  // update data store with the user's items
  useEffect(() => {
    if (userId != null) {
      getItemsByUser(userId, true);
    }
  }, [getItemsByUser, userId]);

  // update state items from data store
  useEffect(() => {
    const newItems: Array<ItemType> = itemsByUser[userId] || [];
    const orderedItems = sortBy(
      newItems,
      (item) => new Date(item.updated_at)
    ).reverse();
    setItems(orderedItems);
  }, [itemsByUser, userId]);


  // // update data store with the user's accounts
  useEffect(() => {
    getAccountsByUser(userId);
  }, [getAccountsByUser, userId]);

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
      {allAccounts.length === 0 && <ErrorMessage />}
      {allAccounts.length > 0 && (
        <>
          <div className="item__header">
            <div>
              <h2 className="item__header-heading">
                {`${allAccounts.length} ${pluralize('Bank', allAccounts.length)} Linked`}
              </h2>
              {!!allAccounts.length && (
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
          {items.map((item) => (
            <div id="itemCards" key={item.id}>
              <ItemCard item={item} userId={userId} />
            </div>
          ))}
          <TransactionTimeline />
        </>
      )}

      {allAccounts.length > 0 && transactions.length === 0 && (
        <div className="loading">
          <LoadingSpinner />
          <LoadingCallout />
        </div>
      )}
      {allAccounts.length > 0 && transactions.length > 0 && (
        <>
          <NetWorth
            accounts={allAccounts}
            numOfItems={items.length}
            personalAssets={assets}
            userId={userId}
            assetsOnly={false}
          />
          <SpendingInsights
            numOfItems={items.length}
            transactions={transactions}
          />
        </>
      )}
      {allAccounts.length === 0 && transactions.length === 0 && assets.length > 0 && (
        <>
          <NetWorth
            accounts={allAccounts}
            numOfItems={items.length}
            personalAssets={assets}
            userId={userId}
            assetsOnly
          />
        </>
      )}
    </div>
  );
};

export default UserPage;
