import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

import './style.scss';

interface Props {
  categories: {
    [key: string]: number;
  };
}

export default function CategoriesChart(props: Props) {
  const data02 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const data01 = useMemo(() => {
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

  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    // @ts-ignore
    cx,
    // @ts-ignore
    cy,
    // @ts-ignore
    midAngle,
    // @ts-ignore
    innerRadius,
    // @ts-ignore
    outerRadius,
    // @ts-ignore
    percent,
    // @ts-ignore
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="grey"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  console.log(data01);

  return (
    <>
      <h4 className="holdingsHeading">Spending Categories</h4>
    <div className="ma-spending-chart">
      {/* <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data01}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={150}
            dataKey="value"
          >
            {data01.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#282c34"
                // fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Tooltip cursor={false} />
          </Pie>
        </PieChart>
      </ResponsiveContainer> */}
      <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={40}
            fill="#8884d8"
          />
          <Pie
            data={data01}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            fill="#82ca9d"
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
    </>
  );
}
