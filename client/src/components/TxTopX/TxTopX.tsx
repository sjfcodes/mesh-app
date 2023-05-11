import React, { useMemo, useState } from 'react';

import { Categories, TransactionType } from '../../types';

import './style.scss';
import TableRow from '../TxTable/TableRow/TableRow';

interface Props {
  filteredTransactions: TransactionType[];
}
const topTxOptions = [8, 16, 24, 32];

const TopVendors = ({ filteredTransactions }: Props) => {
  const [vendorCount, setVendorCount] = useState(topTxOptions[3]);
  const namesObject = useMemo((): Categories => {
    return filteredTransactions.reduce((obj: Categories, txData) => {
      const { transaction: tx } = txData;
      if (!tx.amount || tx.amount < 0) return obj;

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
      <div className="ma-tx-table">
        {sortedNames.map((vendor: any[], i: number) => (
          <TableRow
            key={vendor[0]}
            category={[`${i + 1}`]}
            name={vendor[0]}
            amount={vendor[1] * -1}
          />
        ))}
      </div>
      {/* <ol>
        {sortedNames.map((vendor: any[], index) => (
          <li key={index}>
            <div>
              <p className="vendor">{vendor[0]}</p>
              <p className="amount">{currencyFilter(vendor[1])}</p>
            </div>
          </li>
        ))}
      </ol> */}
    </div>
  );
};

export default TopVendors;
