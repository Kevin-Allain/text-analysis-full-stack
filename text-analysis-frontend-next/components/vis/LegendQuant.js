import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LegendQuant = ({ minScore, maxScore }) => {
  // Generate the gradient color stops
  const calculateColorStops = (min, max) => {
    const stops = [];
    const step = 1 / 99; // 100 steps

    for (let i = 0; i <= 1; i += step) {
      const opacity = 0.05 + i * 0.85;
      stops.push(`rgba(255, 0, 0, ${opacity}) ${i * 100}%`);
    }

    return stops.join(', ');
  };

  const gradient = `linear-gradient(to right, ${calculateColorStops(minScore, maxScore)})`;

  return (
    <div className="container mt-4">
      <h5>Legend</h5>
      <div className="d-flex align-items-center">
        <span>{minScore.toFixed(2)}</span>
        <div
          className="flex-grow-1 mx-2"
          style={{
            height: '20px',
            background: gradient,
          }}
        ></div>
        <span>{maxScore.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default LegendQuant;
