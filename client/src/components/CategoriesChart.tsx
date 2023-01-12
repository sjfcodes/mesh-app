import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from 'recharts';
import colors from 'plaid-threads/scss/colors';

interface Props {
  categories: {
    [key: string]: number;
  };
}

export default function CategoriesChart(props: Props) {
  const data = useMemo(() => {
    const data = [];
    const labels = Object.keys(props.categories);
    const values = Object.values(props.categories);
    for (let i = 0; i < labels.length; i++) {
      data.push({ name: labels[i], value: Math.abs(Math.round(values[i])) });
    }
    return Object.entries(props.categories).map(([label, value]) => ({
      name: label,
      value: Math.abs(Math.round(value)),
    }));
  }, [props.categories]);

  const COLORS = [
    colors.yellow900,
    colors.red900,
    colors.blue900,
    colors.green900,
    colors.black1000,
    colors.purple600,
  ];

  // const renderLabel = (value: any) => {
  //   return `$${value.value.toLocaleString()}`;
  // };
  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <h4 className="holdingsHeading">Spending Categories</h4>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            // label={{
            //   value: 'Monthly Expense',
            //   angle: -90,
            //   position: 'insideLeft',
            // }}
          />
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="value" fill="#61DBFB" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
