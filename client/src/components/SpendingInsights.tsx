import React, { useMemo } from 'react';

import { currencyFilter, pluralize } from '../util';
import CategoriesChart from './CategoriesChart';
import { TransactionType } from '../types';

interface Props {
  transactions: TransactionType[];
  numOfItems: number;
}

interface Categories {
  [key: string]: number;
}

export default function SpendingInsights(props: Props) {
  // grab transactions from most recent month and filter out transfers and payments
  const transactions = props.transactions;

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((txData) => {
        const { transaction: tx } = txData;
        // const date = new Date(tx.date);
        // const today = new Date();
        // const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
        return (
          // date > oneMonthAgo &&
          // tx.category[0] !== 'Payment' &&
          tx.category[0] !== 'Transfer' &&
          tx.category[0] !== 'Interest'
        );
      }),
    [transactions]
  );

  // create category and name objects from transactions

  const categoriesObject = useMemo((): Categories => {
    return filteredTransactions.reduce((obj: Categories, txData) => {
      const { transaction: tx } = txData;
      tx.category[0] in obj
        ? (obj[tx.category[0]] = tx.amount + obj[tx.category[0]])
        : (obj[tx.category[0]] = tx.amount);
      return obj;
    }, {});
  }, [filteredTransactions]);

  const namesObject = useMemo((): Categories => {
    return filteredTransactions.reduce((obj: Categories, txData) => {
      const { transaction: tx } = txData;
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
    namesArray.splice(5); // top 5
    return namesArray;
  }, [namesObject]);

  return (
    <div>
      <h2 className="monthlySpendingHeading">Monthly Spending</h2>
      <h4 className="tableSubHeading">A breakdown of your monthly spending</h4>
      <div className="monthlySpendingText">{`Monthly breakdown across ${
        props.numOfItems
      } bank ${pluralize('account', props.numOfItems)}`}</div>
      <div className="monthlySpendingContainer">
        <div className="spendingInsights">
          <CategoriesChart categories={categoriesObject} />
        </div>
        <div className="spendingInsights">
          <h4 className="holdingsHeading">Top 5 Vendors</h4>
          <div className="spendingInsightData">
            <p className="title">Vendor</p> <p className="title">Amount</p>
            {sortedNames.map((vendor: any[], index) => (
              <div key={index}>
                <p>{vendor[0]}</p>
                <p>{currencyFilter(vendor[1])}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
