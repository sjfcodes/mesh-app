import React from 'react';
import IconButton from 'plaid-threads/IconButton';
import Trash from 'plaid-threads/Icons/Trash';

import { currencyFilter, pluralize } from '../util';
import Asset from './Asset';
import { AccountType, AssetType } from '../types';

interface Props {
  numOfItems: number;
  accounts: AccountType[];
  personalAssets: AssetType[];
  userId: string;
  assetsOnly: boolean;
}

export default function NetWorth(props: Props) {
  // sums of account types
  const addAllAccounts = (
    accountSubtypes: Array<AccountType['subtype']>
  ): number =>
    props.accounts
      .filter((a) => accountSubtypes.includes(a.subtype))
      .reduce((acc: number, val: AccountType) => acc + val.current_balance, 0);

  const depository: number = addAllAccounts([
    'checking',
    'savings',
    'cd',
    'money market',
  ]);
  const investment: number = addAllAccounts(['ira', '401k']);
  const loan: number = addAllAccounts(['student', 'mortgage']);
  const credit: number = addAllAccounts(['credit card']);

  const personalAssetValue = props.personalAssets.reduce((a, b) => {
    return a + b.value;
  }, 0);

  const assets = depository + investment + personalAssetValue;
  const liabilities = loan + credit;

  return (
    <div className="netWorthContainer">
      <h2 className="netWorthHeading">Net Worth</h2>
      <h4 className="tableSubHeading">
        A summary of your assets and liabilities
      </h4>
      {!props.assetsOnly && (
        <>
          <div className="netWorthText">{`Your total across ${
            props.numOfItems
          } bank ${pluralize('account', props.numOfItems)}`}</div>
          <h2 className="netWorthDollars">
            {currencyFilter(assets - liabilities)}
          </h2>
          <div className="holdingsContainer">
            <div className="userDataBox">
              <div className="holdingsList">
                <div className="assetsHeaderContainer">
                  <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>
                  <Asset userId={props.userId} />
                </div>

                <div className="data">
                  {/* 3 columns */}
                  <h4 >assets</h4>
                  <p>{''}</p>
                  <p>{''}</p>
                  <p className="dataItem">cash</p>{' '}
                  <p className="dataItem">{currencyFilter(depository)}</p>
                  <p>{''}</p>
                  <p className="dataItem">investment</p>
                  <p className="dataItem">{currencyFilter(investment)}</p>
                  <p>{''}</p>
                </div>
                <div className="personalAssets">
                  {props.personalAssets.map((asset) => (
                    <div key={asset.id} className="personalAsset">
                      <p className="dataItem">{asset.description}</p>
                      <p className="dataItem">{currencyFilter(asset.value)}</p>
                      <p>
                        <IconButton
                          accessibilityLabel="Navigation"
                          icon={<Trash />}
                          onClick={() => null}
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="userDataBox">
              <div className="holdingsList">
                <h4 className="dollarsHeading">
                  {currencyFilter(liabilities)}
                </h4>

                <div className="data">
                  {/* 3 columns */}
                  <h4 >Liabilities</h4>
                  <p>{''}</p>
                  <p>{''}</p>
                  <p className="dataItem">Credit Cards</p>{' '}
                  <p className="dataItem">{currencyFilter(credit)}</p>
                  <p>{''}</p>
                  <p className="dataItem">Loans</p>
                  <p className="dataItem">{currencyFilter(loan)}</p>
                  <p>{''}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {props.assetsOnly && (
        <>
          <h2 className="netWorthDollars">
            {currencyFilter(assets - liabilities)}
          </h2>
          <div className="holdingsContainer">
            <div className="userDataBox">
              <div className="holdingsList">
                <div className="assetsHeaderContainer">
                  <h4 className="dollarsHeading">{currencyFilter(assets)}</h4>
                  <Asset userId={props.userId} />
                </div>
                <div className="data">
                  <p className="title">Assets</p>
                </div>
                <div className="personalAssets">
                  {props.personalAssets.map((asset) => (
                    <div className="personalAsset">
                      <p className="dataItem">{asset.description}</p>
                      <p className="dataItem">{currencyFilter(asset.value)}</p>
                      <p>
                        <IconButton
                          accessibilityLabel="Navigation"
                          icon={<Trash />}
                          onClick={() => null}
                        />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
