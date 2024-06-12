// BarGraph.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';

const BarGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}> {/* Adjust height as needed */}
      <BarChart
        data={data}
        layout="vertical" // For horizontal bar chart
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={100} 
          tick={<CustomizedAxisTick />} // Custom tick component
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Custom tick component to adjust label size and angle
const CustomizedAxisTick = (props) => {
  const { x, y, payload } = props;

  return (
    <Text x={x} y={y} width={75} textAnchor="end" verticalAnchor="start" angle={-45} fontSize={10}>
      {payload.value}
    </Text>
  );
};

export default BarGraph;
