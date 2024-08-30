import React, { useEffect, useRef } from 'react';

const ScollGraph = ({ data, width = 400, height = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Split data into rows based on newline characters
    const rows = [];
    let currentRow = [];

    data.forEach((item) => {
      if (item.text.includes('Ċ')){ item.text = '\n'; }
      if (item.text === '\n') {
        rows.push(currentRow);
        currentRow = [];
      } else { currentRow.push(item); }
    });

    // Add the last row if there is no newline at the end
    if (currentRow.length > 0) { rows.push(currentRow); }
    // Determine the maximum number of items in a row
    const maxColumns = Math.max(...rows.map(row => row.length));
    // Calculate the size of each square based on the container size
    const squareWidth = width / maxColumns;
    const squareHeight = height / rows.length;
    // Find the max value to normalize the color gradient
    const maxValue = Math.max(...data.filter(item => item.value !== null).map(item => item.value));

    // Helper function to map value to a color
    const getColor = (value) => {
      if (value === null) return 'white';
      const intensity = (value / maxValue);
      return `rgba(0,110, 0, ${intensity})`;  // Green color intensity
    };

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the grid on the canvas
    rows.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        const x = colIndex * squareWidth;
        const y = rowIndex * squareHeight;
        ctx.fillStyle = getColor(item.value);
        ctx.fillRect(x, y, squareWidth, squareHeight);
      });
    });
    console.log("ScrollGraph | width: ",width,", height: ",height);
  }, [data, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '1px solid black' }}
    />
  );
};

export default ScollGraph;
