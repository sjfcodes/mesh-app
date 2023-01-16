import React, { useRef } from 'react';

import { TransactionType } from '../../types';
import { currencyFilter } from '../../util';

import './style.scss';

interface Props {
  transactions: TransactionType[];
}

const TransactionsTable = ({ transactions }: Props) => {
  let { current } = useRef('');

  const getDateDisplay = (dateStr: string) => {
    let toDisplay = new Date(dateStr).toLocaleDateString();

    if (current === toDisplay) toDisplay = '';
    else current = toDisplay;

    return toDisplay;
  };

  if (!transactions?.length) {
    return <></>;
  }

  return (
    <div className="ma-transactions">
      <table className="ma-transactions-table">
        <thead className="ma-transactions-table-header">
          <tr>
            <th className="table-date">Date</th>
            <th className="table-name">Description</th>
            <th className="table-category">Category</th>
            <th className="table-amount">Amount</th>
          </tr>
        </thead>

        <tbody className="ma-transactions-table-body">
          {transactions.map((txData) => {
            const { transaction: tx } = txData;
            if (!tx) return null;
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
};

export default TransactionsTable;
