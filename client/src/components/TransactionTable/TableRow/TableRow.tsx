import React from 'react';
import { currencyFilter } from '../../../util';

import './style.scss';

type Props = {
  category: string[];
  name: string;
  amount: number;
};

const TableRow = ({ category, name, amount }: Props) => {
  return (
    <div className="ma-transactions-table-row">
      <div>
        <p className="ma-table-category">{category.join(', ')}</p>
        <p className="ma-table-name">{name}</p>
      </div>
      <div>
        <p
          className={`ma-table-amount ${amount > 0 ? 'deposit' : 'withdrawal'}`}
        >
          {amount !== 0 && currencyFilter(amount)}
        </p>
      </div>
    </div>
  );
};

export default TableRow;