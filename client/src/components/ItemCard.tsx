import React, { MouseEvent, useEffect, useState } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import { InlineLink } from 'plaid-threads/InlineLink';
import { Callout } from 'plaid-threads/Callout';
import { Institution } from 'plaid/dist/api';

import { diffBetweenCurrentTime } from '../util';
import { ItemType } from '../types';
import useInstitutions from '../hooks/usePlaidInstitutions';
import AccountCard from './AccountCard';
import MoreDetails from './MoreDetails';
import Button from './Button/Button';
import usePlaidItems from '../hooks/usePlaidItems';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  item: ItemType;
  userId: string;
}

const ItemCard = ({ item, userId }: Props) => {
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
  const { institutionsById, getItemInstitution, formatLogoSrc } =
    useInstitutions();
  const { syncItemTransactions } = usePlaidItems();
  const { id, institution_id, tx_cursor_updated_at, updated_at } = item;
  const isSandbox = PLAID_ENV === 'sandbox';

  useEffect(() => {
    setInstitution(institutionsById[institution_id] || {});
  }, [institutionsById, institution_id]);

  useEffect(() => {
    getItemInstitution(institution_id);
  }, [getItemInstitution, institution_id]);

  const cardClassNames = showAccounts
    ? 'card item-card expanded'
    : 'card item-card';

  const itemLastSyncDate = !!tx_cursor_updated_at
    ? diffBetweenCurrentTime(tx_cursor_updated_at)
    : 'never';

  const handleSyncItem = (e: MouseEvent) => {
    e.stopPropagation();
    syncItemTransactions(item.id);
  };

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
            <Note info solid>
              I am a note.
            </Note>
            <Note error solid>
              I am an error
            </Note>
          </div>
          <div className="item-card__column-3">
            <div>
              <h3 className="heading">LAST ACTIVITY</h3>
              <p className="value">{diffBetweenCurrentTime(updated_at)}</p>
            </div>
            <div>
              <h3 className="heading">LAST TX SYNC</h3>
              <div className="item_sync">
                <p className="value">{itemLastSyncDate}</p>
                <Button onClick={handleSyncItem}>Sync</Button>
              </div>
            </div>
          </div>
        </Touchable>
        <MoreDetails // The MoreDetails component allows developer to test the ITEM_LOGIN_REQUIRED webhook and Link update mode
          isBadState={isSandbox}
          handleDelete={() => console.log('handleDelete')}
          handleSetBadState={() => console.log('forSandboxOnly')}
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
