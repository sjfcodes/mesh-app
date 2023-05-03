import React from 'react';

import './style.scss';

const TableHeader = () => {
  return (
    <div className="ma-transactions-table-header">
      <div className="ma-table-name">
        <p>description</p>
      </div>
      <div className="ma-table-amount">
        <p>amount</p>
      </div>
    </div>
  );
};

export default TableHeader;
