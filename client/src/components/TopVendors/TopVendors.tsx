import React, { useMemo } from 'react';

import { Categories, TransactionType } from '../../types';
import { currencyFilter } from '../../util';

import './style.scss';

interface Props {
  filteredTransactions: TransactionType[];
}

const TopVendors = ({ filteredTransactions }: Props) => {
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
    namesArray.splice(5); // top 5
    return namesArray;
  }, [namesObject]);
  return (
    <div>
      <h4>Top 5 Vendors</h4>
      <div>
        <p>Vendor</p>
        <p>Amount</p>
        <ol></ol>
        {sortedNames.map((vendor: any[], index) => (
          <li key={index}>
            <p>{vendor[0]}</p>
            <p>{currencyFilter(vendor[1])}</p>
          </li>
        ))}
      </div>
    </div>
  );
};

export default TopVendors;
