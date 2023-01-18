import React, { useMemo, useState } from 'react';

import { Categories, TransactionType } from '../../types';
import { currencyFilter, pluralize } from '../../util';

import './style.scss';

interface Props {
  filteredTransactions: TransactionType[];
}

const TopVendors = ({ filteredTransactions }: Props) => {
  const [vendorCount, setVendorCount] = useState(5);
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

  const handleSelectVendorCount = (e: any) => setVendorCount(e.target.value);
  return (
    <div className="top-transactions">
      <div className="header">
        <h2>
          Top {vendorCount} {pluralize('transactions', vendorCount)}
        </h2>
        <select value={vendorCount} onChange={handleSelectVendorCount}>
          <option value={5}>5 transactions</option>
          <option value={10}>10 transactions</option>
          <option value={15}>15 transactions</option>
          <option value={20}>20 transactions</option>
        </select>
      </div>
      <ol>
        {sortedNames.map((vendor: any[], index) => (
          <li key={index}>
            <p className="vendor">{vendor[0]}</p>
            <p className="amount">{currencyFilter(vendor[1])}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TopVendors;
