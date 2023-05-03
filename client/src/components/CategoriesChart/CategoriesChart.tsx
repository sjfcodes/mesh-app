import { useMemo } from 'react';
import { Cell, ResponsiveContainer, Pie, PieChart, Legend } from 'recharts';

import { Categories, TransactionType } from '../../types';

import './style.scss';
import SectionHeader from '../SectionHeader/SectionHeader';

interface Props {
  filteredTransactions: TransactionType[];
}

export default function CategoriesChart({ filteredTransactions }: Props) {
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

  const data = useMemo(() => {
    const data = [];
    const labels = Object.keys(categoriesObject);
    const values = Object.values(categoriesObject);
    for (let i = 0; i < labels.length; i++) {
      data.push({ name: labels[i], value: Math.abs(Math.round(values[i])) });
    }
    return Object.entries(categoriesObject)
      .map(([label, value]) => ({
        name: label,
        value: Math.abs(Math.round(value)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [categoriesObject]);

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF42A1'];

  const renderLabel = (value: any) => {
    return `$${value.value.toLocaleString()}`;
  };

  return (
    <div className="spending-categories">
      <SectionHeader text="categories" />
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Legend verticalAlign="top" />
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="45%"
              cy="100%"
              outerRadius="150%"
              label={renderLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index]}
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
