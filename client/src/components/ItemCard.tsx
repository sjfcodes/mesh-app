import React, { MouseEvent, useEffect, useState } from 'react';
import { Institution } from 'plaid/dist/api';

import { diffBetweenCurrentTime } from '../util';
import { ItemType } from '../types';
import useInstitutions from '../hooks/usePlaidInstitutions';
import AccountCard from './AccountCard';
import DefaultButton from './Button/Default/DefaultButton';
import usePlaidItems from '../hooks/usePlaidItems';

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
  const { syncItemTransactions, lastActivity } = usePlaidItems();
  const { institution_id, tx_cursor_updated_at } = item;

  useEffect(() => {
    setInstitution(institutionsById[institution_id] || {});
  }, [institutionsById, institution_id]);

  useEffect(() => {
    getItemInstitution(institution_id);
  }, [getItemInstitution, institution_id]);

  const cardClassNames = showAccounts ? 'expanded' : '';

  const itemLastSyncDate = !!tx_cursor_updated_at
    ? diffBetweenCurrentTime(tx_cursor_updated_at)
    : 'never';

  const handleSyncItem = (e: MouseEvent) => {
    e.stopPropagation();
    syncItemTransactions(item.id);
  };

  return (
    <>
      <div
        className={`ma-item-card ${cardClassNames}`}
        onClick={() => setShowAccounts((current) => !current)}
      >
        <div className="sjf-item-details">
          <img
            className="item-card__img"
            src={formatLogoSrc(institution.logo)}
            alt={institution && institution.name}
          />
          <p>{institution && institution.name}</p>
        </div>
        <div className="sjf-item-sync">
          <div>
            <h3 className="heading">LAST ACTIVITY</h3>
            <p className="value">{diffBetweenCurrentTime(lastActivity)}</p>
          </div>
          <div>
            <h3 className="heading">LAST TX SYNC</h3>
            <p className="value">{itemLastSyncDate}</p>
          </div>
          <DefaultButton onClick={handleSyncItem}>Sync</DefaultButton>
        </div>
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
    </>
  );
};

export default ItemCard;
