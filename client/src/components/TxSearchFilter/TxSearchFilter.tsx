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
        <p>TxSearchFilter</p>
        {dateBand.errorMessage && <p className='ma-filter-error'>error: {dateBand.errorMessage}</p>}
      </div>
      <form>
        <div>
          <label htmlFor="lowerBand">oldest</label>
          <input
            type="date"
            name="lowerBand"
            onInput={handleSetDateBand}
            value={dateBand.lowerBand}
          />
        </div>
        <div>
          <label htmlFor="upperBand">newest</label>
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
