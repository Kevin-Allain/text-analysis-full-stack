import React, { useEffect, useRef } from 'react';

const ScrollGraph = ({ data, width = 400, height = 600, onScrollPositionChange, scrollRatio }) => {
  const canvasRef = useRef(null);
  const rectHeight = 60; // Height of the scroll rectangle

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

      // Calculate the scrollRatio based on click position
      let clickRatio = y / rect.height;

      // Calculate where the middle of the rectangle should go
      let newScrollRatio = clickRatio;

      // Adjust the position to ensure the rectangle stays within bounds
      if (newScrollRatio * height - rectHeight / 2 < 0) {
        newScrollRatio = rectHeight / 2 / height; // Prevent the top from going over
      } else if (newScrollRatio * height + rectHeight / 2 > height) {
        newScrollRatio = (height - rectHeight / 2) / height; // Prevent the bottom from going under
      }

      onScrollPositionChange(newScrollRatio); // Pass the adjusted position to the parent
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Cleanup event listener on component unmount
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [data, width, height, onScrollPositionChange]);

  // Calculate the top position of the rectangle based on the scroll ratio
  const rectTop = Math.min(Math.max(scrollRatio * height - rectHeight / 2, 0), height - rectHeight);

  return (
    <div style={{ position: 'relative', width: '100%', height: '65vh' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          height: '100%',  // Make the canvas take the full height of the container
          width: '100%',   // Make the canvas take the full width of the container
          cursor: 'pointer',
        }}
      />
      {/* Transparent rectangle with black borders */}
      <div
        style={{
          position: 'absolute',
          top: `${rectTop}px`,
          left: 0,
          width: '100%',
          height: `${rectHeight}px`,
          border: '2px solid black',
          backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
          pointerEvents: 'none', // Ensure the rectangle does not block interactions with the canvas
        }}
      />
    </div>
  );
};

export default ScrollGraph;
