import React, { useRef } from 'react';

import { TransactionType } from '../../types';
import { currencyFilter } from '../../util';

import './style.scss';

interface Props {
  transactions: TransactionType[];
  fullHeight?: boolean;
}

const TransactionsTable = ({ transactions, fullHeight = false }: Props) => {
  let { current } = useRef('');

  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const dateIsCurrent = (date: string) => date === current;

  const getDateDisplay = (dateStr: string) => {
    let toDisplay = formatDate(dateStr);

    if (dateIsCurrent(toDisplay)) toDisplay = '';
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
            <th className="ma-table-name">Description</th>
            <th className="ma-table-amount">Amount</th>
          </tr>
        </thead>

        <tbody
          className={`ma-transactions-table-body ${
            fullHeight ? 'full-height' : ''
          }`}
        >
          {transactions.map((txData) => {
            const { transaction: tx } = txData;
            if (!tx) return null;
            const toRender = [];
            const amount = tx.amount * -1;
            const toDisplay = formatDate(tx.date);
            if (!dateIsCurrent(toDisplay)) {
              toRender.push(
                <tr key={`tr-date-${toDisplay}`}>
                  <td className="ma-table-date-row" colSpan={3}>
                    {getDateDisplay(tx.date)}
                  </td>
                </tr>
              );
            }
            toRender.push(
              <tr key={tx.transaction_id}>
                <td>
                  <p className="ma-table-category">{tx.category.join(', ')}</p>
                  <p className="ma-table-name">{tx.name}</p>
                </td>
                <td>
                  <p
                    className={`ma-table-amount ${
                      amount > 0 ? 'deposit' : 'withdrawal'
                    }`}
                  >
                    {amount !== 0 && currencyFilter(amount)}
                  </p>
                </td>
              </tr>
            );

            return toRender;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
