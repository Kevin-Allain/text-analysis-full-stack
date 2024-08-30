import React from 'react';

const ScollGraph = ({ data, width = '100%', height = '100%' }) => {
  // Split data into rows based on newline characters
  console.log("ScrollGraph | data: ", data);
  const rows = [];
  let currentRow = [];

  data.forEach((item) => {
    if (item.text.includes('Ċ')){
      item.text='\n';
    }
    if (item.text === '\n') {
      rows.push(currentRow);
      currentRow = [];
    } else {
      currentRow.push(item);
    }
  });

  // Add the last row if there is no newline at the end
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  // Determine the maximum number of items in a row
  const maxColumns = Math.max(...rows.map(row => row.length));

  // Pad rows with empty items to ensure consistent column count
  const paddedRows = rows.map(row => {
    if (row.length < maxColumns) {
      return [
        ...row,
        ...Array.from({ length: maxColumns - row.length }).map(() => ({
          text: '',
          value: null
        }))
      ];
    }
    return row;
  });

  // Calculate the size of each square based on the container size
  const squareWidth = `calc(100% / ${maxColumns})`;
  const squareHeight = `calc(${height} / ${paddedRows.length})`;

  // Find the max value to normalize the color gradient
  const maxValue = Math.max(...data.filter(item => item.value !== null).map(item => item.value));

  // Helper function to map value to a color
  const getColor = (value) => {
    if (value === null) return 'transparent';
    const intensity = (value / maxValue);
    return `rgb(0, 100, 0, ${intensity})`;  // Green color intensity
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${maxColumns}, 1fr)`,
        gridTemplateRows: `repeat(${paddedRows.length}, 1fr)`,
        width: width,
        height: height,
        boxSizing: 'border-box',
        border: "solid",
      }}
    >
      {paddedRows.flat().map((item, index) => (
        <div
          key={index}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: item.text ? getColor(item.value) : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            border: 'none',
            color: 'black',
            fontSize: '1rem',
          }}
        >
          {/* {item.text} */}
        </div>
      ))}
    </div>
  );
};

export default ScollGraph;
