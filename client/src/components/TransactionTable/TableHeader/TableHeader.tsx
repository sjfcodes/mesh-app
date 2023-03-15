import React from 'react';

import './style.scss';

const TableHeader = () => {
  return (
    <div className="ma-transactions-table-header">
      <div className="ma-table-name">
        <p>Description</p>
      </div>
      <div className="ma-table-amount">
        <p>Amount</p>
      </div>
    </div>
  );
};

export default TableHeader;
