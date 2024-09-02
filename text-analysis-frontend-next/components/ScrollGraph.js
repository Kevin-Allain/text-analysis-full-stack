import React, { useEffect, useRef } from 'react';

const ScollGraph = ({ data, width = 400, height = 200, onScrollPositionChange }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Split data into rows based on newline characters
    const rows = [];
    let currentRow = [];

    data.forEach((item) => {
      if (item.text.includes('Ċ')) {
        item.text = '\n';
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
    
    // Calculate the size of each square based on the container size
    const squareWidth = width / maxColumns;
    const squareHeight = height / rows.length;

    // Find the max value to normalize the color gradient
    const maxValue = Math.max(...data.filter(item => item.value !== null).map(item => item.value));

    // Helper function to map value to a color
    const getColor = (value) => {
      if (value === null) return 'white';
      const intensity = (value / maxValue);
      return `rgba(0, 110, 0, ${0.25 + intensity})`;  // Green color intensity
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

    // Add click event listener to canvas
    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const y = event.clientY - rect.top; // Y-coordinate of the click relative to the canvas top
      const relativePosition = Math.min(Math.max(y / rect.height, 0), 1); // Clamp value between 0 and 1
      onScrollPositionChange(relativePosition); // Pass the relative position to the parent component
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Cleanup event listener on component unmount
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };

  }, [data, width, height, onScrollPositionChange]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ 
        height: '75vh',
        width: '100%',
        cursor: 'pointer'  // Change cursor to indicate interactivity
      }}
    />
  );
};

export default ScollGraph;
