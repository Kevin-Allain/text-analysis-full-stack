import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LegendBinned = ({ minScore, maxScore, bins, onSelectBin, selectedBin }) => {
  const binSize = (maxScore - minScore) / bins;
  const calculateOpacity = (binIndex, totalBins) => {
    if (totalBins === 1) return 0.90;
    return 0.05 + (binIndex / (totalBins - 1)) * 0.85;
  };

  return (
    <div className="container mt-4">
      <h5>Legend</h5>
      <div className="d-flex align-items-center">
        <span>{minScore.toFixed(2)}</span>
        <div className="d-flex flex-grow-1 mx-2">
          {Array.from({ length: bins }, (_, binIndex) => {
            const binStart = minScore + binIndex * binSize;
            const binEnd = binStart + binSize;
            const opacity = calculateOpacity(binIndex, bins);
            return (
              <div
                key={binIndex}
                onClick={() => onSelectBin(binIndex, binStart, binEnd)}
                style={{
                  flex: 1,
                  height: '20px',
                  backgroundColor: `rgba(255, 0, 0, ${opacity})`,
                  cursor: 'pointer',
                  border: selectedBin === binIndex ? '2px solid black' : '1px solid #ddd',
                }}
                title={`Range: ${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`}
              ></div>
            );
          })}
        </div>
        <span>{maxScore.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default LegendBinned;
