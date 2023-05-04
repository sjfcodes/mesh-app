import React, { useRef } from 'react';
import { TransactionType } from '../../types';
import TableRow from './TableRow/TableRow';

import './style.scss';

type Props = {
  transactions: TransactionType[];
  fullHeight?: boolean;
};

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
    <>
      <div className="ma-transactions-table">
        {transactions.map((txData) => {
          const { transaction: tx } = txData;
          if (!tx) return null;
          const toRender = [];
          const amount = tx.amount * -1;
          const toDisplay = formatDate(tx.date);

          if (!dateIsCurrent(toDisplay)) {
            toRender.push(
              <div key={`tr-date-${toDisplay}`} className="ma-table-row-date">
                <p>{getDateDisplay(tx.date)}</p>
              </div>
            );
          }

          toRender.push(
            <TableRow
              key={tx.transaction_id}
              category={tx.category}
              name={tx.name}
              amount={amount}
            />
          );

          return toRender;
        })}
      </div>
    </>
  );
};

export default TransactionsTable;
