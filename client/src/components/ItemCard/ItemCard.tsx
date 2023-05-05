import { MouseEvent, useEffect, useState } from 'react';
import { Institution } from 'plaid/dist/api';

import { diffBetweenCurrentTime } from '../../util';
import { ItemType } from '../../types';
import useInstitutions from '../../hooks/usePlaidInstitutions';
import AccountCard from '../AccountCard/AccountCard';
import DefaultButton from '../Button/Default/DefaultButton';
import usePlaidItems from '../../hooks/usePlaidItems';
import ButtonUpdateItem from '../ButtonUpdateItem/ButtonUpdateItem';

import './style.scss';
import Loader from '../Loader/Loader';

interface Props {
  item: ItemType;
}

const defaultInstitution = {
  country_codes: [],
  institution_id: '',
  logo: '',
  name: '',
  oauth: false,
  primary_color: '',
  products: [],
  routing_numbers: [],
  url: '',
};

const ItemCard = ({ item }: Props) => {
  const { institutionsById, getItemInstitution, formatLogoSrc } =
    useInstitutions();
  const { syncItemTransactions, lastActivity, isLoading } = usePlaidItems();
  const [institution, setInstitution] =
    useState<Institution>(defaultInstitution);
  const useSelectedAccount = useState('');

  useEffect(() => {
    setInstitution(institutionsById[item.institution_id] || {});
  }, [institutionsById, item.institution_id]);

  useEffect(() => {
    getItemInstitution(item.institution_id);
  }, [getItemInstitution, item.institution_id]);

  const itemLastSyncDate = item.tx_cursor_updated_at
    ? diffBetweenCurrentTime(item.tx_cursor_updated_at)
    : 'never';

  const handleSyncItem = (e: MouseEvent) => {
    e.stopPropagation();
    syncItemTransactions(item.id);
  };

  if (!institution) {
    return <Loader />;
  }

  return (
    <div className="ma-item-card">
      <div className="ma-item-card-header">
        {institution &&
          institution.name?.split('-').map((section, key) => (
            <h3 style={{ color: institution.primary_color || '' }} key={key}>
              {' '}
              {section}
            </h3>
          ))}
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
              <h3>last sync</h3>
              <p>{itemLastSyncDate}</p>
            </li>
            {/* <li>
              <h3>routing #</h3>
              <p>{institution.routing_numbers}</p>
            </li> */}
            <li>
              <ButtonUpdateItem itemId={item.id} />
            </li>
            <li>
              <DefaultButton onClick={handleSyncItem} isLoading={isLoading}>
                sync txs
              </DefaultButton>
            </li>
          </ul>
        </div>
      </div>
      <div className="ma-item-card-footer">
        {item.accounts.length > 0 &&
          item.accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              useSelectedAccount={useSelectedAccount}
            />
          ))}
      </div>
    </div>
  );
};

export default ItemCard;
