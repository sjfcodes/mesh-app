import { useEffect, useState } from 'react';
import { Institution } from 'plaid/dist/api';

import { diffBetweenCurrentTime, formatLogoSrc } from '../../util/helpers';
import { ItemType } from '../../types';
import useInstitutions from '../../hooks/usePlaidInstitutions';
import AccountCard from '../AccountCard/AccountCard';
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
  const { syncTransactionsByItemId } = usePlaidItems();
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

  useEffect(() => {
    /**
     * auto call sync transactions if item has never been synced
     * or item has not been synced in {target} minutes
     */
    if (!item.tx_cursor_updated_at) {
      syncTransactionsByItemId(item.id);
      return;
    }

    const target = 10;
    const thresholdMs = Date.now() - target * 60 * 1000;
    const lastTxSyncMs = new Date(item.tx_cursor_updated_at).getTime();

    if (lastTxSyncMs < thresholdMs) {
      syncTransactionsByItemId(item.id);
    }
  }, []);

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
      <div className="ma-item-card-body">
        <a
          className="ma-item-logo"
          href={institution.url || ''}
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={formatLogoSrc(institution.logo)}
            alt={institution && institution.name}
          />
        </a>
        <div className="ma-item-card-details">
          {institution.name && (
            <>
              <div>
                <h3 style={{ color: institution.primary_color || '' }}>
                  {institution.name}
                </h3>
                <h3>updated {itemLastSyncDate}</h3>
              </div>
              <ButtonUpdateItem itemId={item.id} />
            </>
          )}
        </div>
      </div>
      <div className="ma-item-card-footer">{getAccountCards()}</div>
    </div>
  );
};

export default ItemCard;
