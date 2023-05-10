import React, { useMemo, useState } from 'react';

import { Categories, TransactionType } from '../../types';
import { currencyFilter } from '../../util/helpers';

import './style.scss';

interface Props {
  filteredTransactions: TransactionType[];
}
const topTxOptions = [8, 16, 24, 32];

const TopVendors = ({ filteredTransactions }: Props) => {
  const [vendorCount, setVendorCount] = useState(topTxOptions[3]);
  const namesObject = useMemo((): Categories => {
    return filteredTransactions.reduce((obj: Categories, txData) => {
      const { transaction: tx } = txData;
      tx.name in obj
        ? (obj[tx.name] = tx.amount + obj[tx.name])
        : (obj[tx.name] = tx.amount);
      return obj;
    }, {});
  }, [filteredTransactions]);

  // sort names by spending totals
  const sortedNames = useMemo(() => {
    const namesArray = [];
    for (const name in namesObject) {
      namesArray.push([name, namesObject[name]]);
    }
    namesArray.sort((a: any[], b: any[]) => b[1] - a[1]);
    namesArray.splice(vendorCount);
    return namesArray;
  }, [namesObject, vendorCount]);

  const handleSelectVendorCount = (e: any) =>
    setVendorCount(parseInt(e.target.value));
  return (
    <div className="tx-top-x">
      <div className="ma-top-tx-selector">
        <div>
          <h2>display</h2>
          <select value={vendorCount} onChange={handleSelectVendorCount}>
            {topTxOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ol>
        {sortedNames.map((vendor: any[], index) => (
          <li key={index}>
            <div>
              <p className="vendor">{vendor[0]}</p>
              <p className="amount">{currencyFilter(vendor[1])}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TopVendors;
