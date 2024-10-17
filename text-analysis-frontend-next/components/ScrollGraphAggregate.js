import React, { useEffect, useRef } from 'react';

const ScrollGraphAggregate = ({ data, globalData, width = 400, height = 600, onScrollPositionChange, scrollRatio, colorBases }) => {
  const canvasRef = useRef(null);
  const rectHeight = 60; // Height of the scroll rectangle

  console.log("ScrollGraphAggregate | globalData: ",globalData);
  let scoresTotal = [];
  globalData.map(a => scoresTotal = scoresTotal.concat(a.details.map(b => b.value) ) );
  console.log("~~~~ ScrollGraphAggregate | scoresTotal: ", scoresTotal);
  let maxScore = Math.max(...scoresTotal);



  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    // Split data into rows based on newline characters
    const rows = [];
    let currentRow = [];
    data.forEach((item) => {
      if (item.text.includes('Ċ')) { item.text = '\n'; }
      if (item.text === '\n') { rows.push(currentRow); currentRow = []; } else { currentRow.push(item); }
    });
    // Add the last row if there is no newline at the end
    if (currentRow.length > 0) { rows.push(currentRow); }

    // Calculate the average value for each row
    const averageValues = rows.map((row) => {
      const total = row.reduce((sum, item) => (item.value !== null ? sum + item.value : sum), 0);
      const count = row.filter(item => item.value !== null).length;
      return count > 0 ? total / count : null;
    });

    // Find the max average value to normalize the bins
    const maxValue = Math.max(...averageValues.filter(value => value !== null));
    // Helper function to map average value to a binned color
    const getBinnedColor = (value) => {
      if (value === null) return 'white';
      // // Calculate bins based on the range of values
      // const bin1 = maxValue * 0.75; // Highest scores bin
      // const bin2 = maxValue * 0.5;  // Mid-high scores bin
      // const bin3 = maxValue * 0.25; // Mid-low scores bin
      // Updated with maxScore passed in JSON
      const bin1 = maxScore * 0.75; // Highest scores bin
      const bin2 = maxScore * 0.5;  // Mid-high scores bin
      const bin3 = maxScore * 0.25; // Mid-low scores bin

      // TODO update so that colours are passed
      // Assign color based on which bin the value falls into
      if (value >= bin1) { return colorBases[3]; /* Dark green */ } else if (value >= bin2) { return colorBases[2]; /* Mid green */} else if (value >= bin3) { return colorBases[1]; /* Light grey-green */ } else { return colorBases[0]; /* Lowest scores */ }
    };
    // Calculate the height of each square based on the number of rows
    const squareHeight = height / rows.length;
    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw one square per row based on the average value
    averageValues.forEach((averageValue, rowIndex) => {
      const y = rowIndex * squareHeight;
      ctx.fillStyle = getBinnedColor(averageValue);
      ctx.fillRect(0, y, width, squareHeight); // One square per row, spanning the entire width
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
    <div style={{
      position: 'relative', 
      height: "100%",
      border: "solid",
      borderRadius: ".25rem",
      borderWidth: "thin",
      borderColor: "#115b4e",
      overflow: "hidden",
    }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ 
          height: '100%', width: '100%', cursor: 'pointer' 
        }}
      />
      {/* Transparent rectangle with black borders */}
      <div
        style={{
          position: 'absolute',
          top: `${rectTop}px`,
          left: 0,
          width: '100%',
          height: '100%',
          // backgroundColor: colorBases[0],
          pointerEvents: 'none', // Ensure the rectangle does not block interactions with the canvas
        }}
      />
    </div>
  );
};

export default ScrollGraphAggregate;
