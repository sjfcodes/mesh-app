import { useMemo } from 'react';
import { Cell, ResponsiveContainer, Pie, PieChart, Legend } from 'recharts';

import './style.scss';

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
    return Object.entries(props.categories)
      .map(([label, value]) => ({
        name: label,
        value: Math.abs(Math.round(value)),
      }))
      .sort((a, b) => b.value - a.value);
  }, [props.categories]);

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF42A1'];

  const renderLabel = (value: any) => {
    return `$${value.value.toLocaleString()}`;
  };

  return (
    <>
      <h4 className="holdingsHeading">Spending Categories</h4>
      <div className="spending-insights">
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
    </>
  );
}
