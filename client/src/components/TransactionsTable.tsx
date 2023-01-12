import React, { useRef } from 'react';
import { TransactionType } from '../types';

import { currencyFilter } from '../util';

interface Props {
  transactions: TransactionType[];
}

export default function TransactionsTable(props: Props) {
  let { current } = useRef('');

  const getDateDisplay = (dateStr: string) => {
    let toDisplay = new Date(dateStr).toLocaleDateString();

    if (current === toDisplay) toDisplay = '';
    else current = toDisplay;

    return toDisplay;
  };

  return (
    <div className="transactions">
      <table className="transactions-table">
        <thead className="transactions-header">
          <tr>
            <th className="table-date">Date</th>
            <th className="table-name">Description</th>
            <th className="table-category">Category</th>
            <th className="table-amount">Amount</th>
          </tr>
        </thead>
        <tbody className="transactions-body">
          {props.transactions.map((data) => {
            const { transaction: tx } = data;
            const amount = tx.amount * -1;
            return (
              <tr key={tx.transaction_id} className="transactions-data-rows">
                <td className="table-date">{getDateDisplay(tx.date)}</td>
                <td className="table-name">{tx.name}</td>
                <td className="table-category">{tx.category}</td>
                <td
                  className={`table-amount ${
                    amount > 0 ? 'deposit' : 'withdrawal'
                  }`}
                >
                  {currencyFilter(amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
