import React from 'react';

const RectGraphScore = ({ data, width = '100%', height = '100%', padding = 2 }) => {
  // Count the number of squares before a newline to determine the number of columns
  const numColumns = data.includes('\n') 
    ? data.indexOf(data.find(item => item.text === '\n'))
    : data.length;

  // Calculate the size of each square based on the container size
  const squareSize = `calc((100% - ${padding * (numColumns - 1)}px) / ${numColumns})`;

  // Find the max value to normalize the color gradient
  const maxValue = Math.max(...data.filter(item => item.value !== null).map(item => item.value));

  // Helper function to map value to a color
  const getColor = (value) => {
    if (value === null) return 'transparent';
    const intensity = Math.floor((value / maxValue) * 255);
    return `rgb(0, ${intensity}, 0)`;  // Green color intensity
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        width: width, 
        height: height, 
        boxSizing: 'border-box' 
      }}
    >
      {data.map((item, index) => (
        item.text === '\n' ? (
          <div key={index} style={{ width: '100%', height: 0 }} />
        ) : (
          <div
            key={index}
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: getColor(item.value),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: padding / 2,
              border: '1px solid #ccc',
              color: '#fff',
              fontSize: '1rem',
            }}
          >
            {item.text}
          </div>
        )
      ))}
    </div>
  );
};

export default RectGraphScore;
