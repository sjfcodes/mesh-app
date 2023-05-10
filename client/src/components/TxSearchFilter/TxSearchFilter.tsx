import React from 'react';

import './style.scss';
import useTransactions from '../../hooks/usePlaidTransactions';

const TxSearchFilter = () => {
  const { dateBand, setDateBand } = useTransactions();

  const handleSetDateBand: React.FormEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target as HTMLInputElement;

    setDateBand({ [name]: value });
  };

  return (
    <div className="ma-tx-search-filter">
      <div className="ma-search-filter-header">
        {dateBand.errorMessage && (
          <p className="ma-filter-error">error: {dateBand.errorMessage}</p>
        )}
      </div>
      <form>
        <div>
          <input
            type="date"
            name="lowerBand"
            onInput={handleSetDateBand}
            value={dateBand.lowerBand}
          />
        </div>
        <p>{'->'}</p>
        <div>
          <input
            type="date"
            name="upperBand"
            onInput={handleSetDateBand}
            value={dateBand.upperBand}
          />
        </div>
      </form>
    </div>
  );
};

export default TxSearchFilter;
