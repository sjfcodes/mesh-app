import React, { useEffect, useState } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import { InlineLink } from 'plaid-threads/InlineLink';
import { Callout } from 'plaid-threads/Callout';
import { Institution } from 'plaid/dist/api';

import { diffBetweenCurrentTime } from '../util';
import { ItemType } from '../types';
// import useApi from '../hooks/useApi';
// import useItems from '../hooks/useItems';
import useInstitutions from '../hooks/useInstitutions';
import useTransactions from '../hooks/useTransactions';
import AccountCard from './AccountCard';
import MoreDetails from './MoreDetails';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  item: ItemType;
  userId: string;
}

const ItemCard = ({ item, userId }: Props) => {
  // const { setItemToBadState } = useApi();
  // const { itemAccounts, deleteAccountsByItemId } = useAccounts();
  const [institution, setInstitution] = useState<Institution>({
    logo: '',
    name: '',
    institution_id: '',
    oauth: false,
    products: [],
    country_codes: [],
    routing_numbers: [],
  });
  const [showAccounts, setShowAccounts] = useState(true);
  // const { deleteItemById } = useItems();
  const { deleteTransactionsByItemId } = useTransactions();
  const { institutionsById, getItemInstitution, formatLogoSrc } =
    useInstitutions();
  const { id, institution_id, status } = item;
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';

  useEffect(() => {
    console.log({ item });
  }, []);

  useEffect(() => {
    setInstitution(institutionsById[institution_id] || {});
  }, [institutionsById, institution_id]);

  useEffect(() => {
    getItemInstitution(institution_id);
  }, [getItemInstitution, institution_id]);

  // const handleSetBadState = () => {
  //   setItemToBadState(id);
  // };
  const handleDeleteItem = () => {
    // deleteItemById(id, userId);
    // deleteAccountsByItemId(id);
    deleteTransactionsByItemId(id);
  };

  const cardClassNames = showAccounts
    ? 'card item-card expanded'
    : 'card item-card';
  return (
    <div className="box">
      <div className={cardClassNames}>
        <Touchable
          className="item-card__clickable"
          onClick={() => setShowAccounts((current) => !current)}
        >
          <div className="item-card__column-1">
            <img
              className="item-card__img"
              src={formatLogoSrc(institution.logo)}
              alt={institution && institution.name}
            />
            <p>{institution && institution.name}</p>
          </div>
          <div className="item-card__column-2">
            {isGoodState ? (
              <Note info solid>
                Updated
              </Note>
            ) : (
              <Note error solid>
                Login Required
              </Note>
            )}
          </div>
          <div className="item-card__column-3">
            <h3 className="heading">LAST UPDATED</h3>
            <p className="value">{diffBetweenCurrentTime(item.updated_at)}</p>
          </div>
        </Touchable>
        <MoreDetails // The MoreDetails component allows developer to test the ITEM_LOGIN_REQUIRED webhook and Link update mode
          isBadState={isSandbox && isGoodState}
          handleDelete={handleDeleteItem}
          handleSetBadState={
            /*handleSetBadState*/ () =>
              console.log('handleSetBadState forSandboxOnly')
          }
          userId={userId}
          itemId={id}
        />
      </div>
      {showAccounts && item.accounts.length > 0 && (
        <div>
          {item.accounts.map((account) => (
            <div key={account.id}>
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      )}
      {showAccounts && item.accounts.length === 0 && (
        <Callout>
          No transactions or accounts have been retrieved for this item. See the{' '}
          <InlineLink href="https://github.com/plaid/pattern/blob/master/docs/troubleshooting.md">
            {' '}
            troubleshooting guide{' '}
          </InlineLink>{' '}
          to learn about receiving transactions webhooks with this sample app.
        </Callout>
      )}
    </div>
  );
};

export default ItemCard;
