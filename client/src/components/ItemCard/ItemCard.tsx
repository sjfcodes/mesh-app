import { MouseEvent, useEffect, useState } from 'react';
import { Institution } from 'plaid/dist/api';

import { diffBetweenCurrentTime, formatLogoSrc } from '../../util/helpers';
import { ItemType } from '../../types';
import useInstitutions from '../../hooks/usePlaidInstitutions';
import AccountCard from '../AccountCard/AccountCard';
import DefaultButton from '../Button/Default/DefaultButton';
import usePlaidItems from '../../hooks/usePlaidItems';
import ButtonUpdateItem from '../ButtonUpdateItem/ButtonUpdateItem';

import Loader from '../Loader/Loader';
import { AccountId } from '../../services/Plaid/Institutions/types';

import './style.scss';

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
  const {
    accountBalances,
    institutionsById,
    getInstitutionById,
    getBalancesByAccountId,
  } = useInstitutions();
  const { syncTransactionsByItemId, isLoading } = usePlaidItems();
  const useSelectedAccount = useState('' as AccountId);
  const [institution, setInstitution] = useState(
    defaultInstitution as Institution
  );

  useEffect(() => {
    setInstitution(institutionsById[item.institution_id] || {});
  }, [institutionsById, item.institution_id]);

  useEffect(() => {
    getInstitutionById(item.institution_id);
  }, [getInstitutionById, item.institution_id]);

  useEffect(() => {
    getBalancesByAccountId(item.id);
  }, [getBalancesByAccountId]);

  const itemLastSyncDate = item.tx_cursor_updated_at
    ? diffBetweenCurrentTime(item.tx_cursor_updated_at)
    : 'never';

  const handleSyncItem = (e: MouseEvent) => {
    e.stopPropagation();
    syncTransactionsByItemId(item.id);
  };

  const getAccountCards = () => {
    if (!accountBalances || !Array.isArray(accountBalances)) {
      return [];
    }

    return item.accounts.map((account) => {
      const balance = accountBalances.filter(
        (balance) => balance.account_id === account.id
      );
      return (
        <AccountCard
          key={account.id}
          account={account}
          balance={balance[0]}
          useSelectedAccount={useSelectedAccount}
        />
      );
    });
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
              <h3>last sync</h3>
              <p>{itemLastSyncDate}</p>
            </li>
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
      <div className="ma-item-card-footer">{getAccountCards()}</div>
    </div>
  );
};

export default ItemCard;
