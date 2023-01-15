import { MouseEvent, useEffect, useState } from 'react';
import { Institution } from 'plaid/dist/api';

import { diffBetweenCurrentTime } from '../../util';
import { ItemType } from '../../types';
import useInstitutions from '../../hooks/usePlaidInstitutions';
import AccountCard from '../AccountCard';
import DefaultButton from '../Button/Default/DefaultButton';
import usePlaidItems from '../../hooks/usePlaidItems';

import './style.scss';

interface Props {
  item: ItemType;
}

const ItemCard = ({ item }: Props) => {
  const { institutionsById, getItemInstitution, formatLogoSrc } =
    useInstitutions();
  const { syncItemTransactions, lastActivity } = usePlaidItems();
  const [institution, setInstitution] = useState<Institution>({
    country_codes: [],
    institution_id: '',
    logo: '',
    name: '',
    oauth: false,
    primary_color: '',
    products: [],
    routing_numbers: [],
    url: '',
  });
  const [showAccounts, setShowAccounts] = useState(true);
  const { institution_id, tx_cursor_updated_at } = item;

  useEffect(() => {
    console.log(institution);
  }, [institution]);

  useEffect(() => {
    setInstitution(institutionsById[institution_id] || {});
  }, [institutionsById, institution_id]);

  useEffect(() => {
    getItemInstitution(institution_id);
  }, [getItemInstitution, institution_id]);

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
        className="ma-item-card"
        onClick={() => setShowAccounts((current) => !current)}
      >
        <div className="ma-item-card-header">
          <h3 style={{ color: institution.primary_color || '' }}>
            {institution && institution.name}
          </h3>
        </div>
        <div className="ma-item-card-body">
          <a href={institution.url || ''} target="_blank" rel="noreferrer">
            <img
              src={formatLogoSrc(institution.logo)}
              alt={institution && institution.name}
            />
          </a>
          <div className="ma-item-card-details">
            <ul>
              <li>
                <h3>last activity</h3>
                <p>{diffBetweenCurrentTime(lastActivity)}</p>
              </li>
              <li>
                <h3>routing #</h3>
                <p>{institution.routing_numbers}</p>
              </li>
              <li>
                <h3>key</h3>
                <p>value</p>
              </li>
            </ul>
            <ul>
              <li>
                <h3>last sync</h3>
                <p>{itemLastSyncDate}</p>
              </li>
              <li>
                <DefaultButton onClick={handleSyncItem}>
                  sync transactions
                </DefaultButton>
              </li>
            </ul>
          </div>
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
